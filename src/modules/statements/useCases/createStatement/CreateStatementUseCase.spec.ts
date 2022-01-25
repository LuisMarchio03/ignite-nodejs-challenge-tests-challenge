import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statements", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should not be able to create a new statements with user does not exists", async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        amount: 100,
        description: "Example statement DEPOSIT",
        type: OperationType.DEPOSIT,
        user_id: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shoul not be able to withdraw with insufficient funds", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });

      await createStatementUseCase.execute({
        amount: 1000,
        description: "Example statement WITHDRAW",
        type: OperationType.WITHDRAW,
        user_id: String(user.id),
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new statements DEPOSIT", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: "Example statement DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    });

    expect(statement).toHaveProperty("id");
  });

  it("should be able to create a new statements WITHDRAW", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });

    await inMemoryStatementsRepository.create({
      amount: 500,
      description: "Example statement DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: String(user.id),
    });

    const statement = await createStatementUseCase.execute({
      amount: 200,
      description: "Example statement WITHDRAW",
      type: OperationType.WITHDRAW,
      user_id: String(user.id),
    });

    expect(statement).toHaveProperty("id");
  });
});

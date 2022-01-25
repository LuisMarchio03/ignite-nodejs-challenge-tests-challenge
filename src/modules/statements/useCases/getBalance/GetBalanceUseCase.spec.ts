import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    );
  });

  it("should not be able to get balance with user does not exists", async () => {
    expect(async () => {
      const user_id = "123";

      await getBalanceUseCase.execute({
        user_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("shoul be able to get balance - not statements and balance 0", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });

    const user_id = String(user.id);

    const balance = await getBalanceUseCase.execute({
      user_id,
    });

    expect(balance).toEqual({ statement: [], balance: 0 });
  });

  it("shoul be able to get balance - balance 0", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });
    const user_id = String(user.id);

    const deposit = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Example statement DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user_id,
    });

    const withdraw = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Example statement DEPOSIT",
      type: OperationType.WITHDRAW,
      user_id: user_id,
    });

    const balance = await getBalanceUseCase.execute({
      user_id,
    });

    expect(balance).toEqual({ statement: [deposit, withdraw], balance: 0 });
  });

  it("shoul be able to get balance - statements: true and balance: 700", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });
    const user_id = String(user.id);

    const deposit = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Example statement DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user_id,
    });

    const withdraw = await inMemoryStatementsRepository.create({
      amount: 300,
      description: "Example statement DEPOSIT",
      type: OperationType.WITHDRAW,
      user_id: user_id,
    });

    const balance = await getBalanceUseCase.execute({
      user_id,
    });

    expect(balance).toEqual({
      statement: [deposit, withdraw],
      balance: 700,
    });
  });
});

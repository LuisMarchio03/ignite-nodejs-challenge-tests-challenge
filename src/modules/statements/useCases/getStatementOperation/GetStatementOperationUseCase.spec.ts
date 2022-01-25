import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: IUsersRepository;
let inMemoryStatementsRepository: IStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should not be able to get balance with user does not exists", async () => {
    expect(async () => {
      const user_id = "123";

      const statement = await inMemoryStatementsRepository.create({
        amount: 1000,
        description: "Example statement DEPOSIT",
        type: OperationType.DEPOSIT,
        user_id: user_id,
      });
      const statement_id = String(statement.id);

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to get balance with statement does not exists", async () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });
      const user_id = String(user.id);
      const statement_id = "123";

      await getStatementOperationUseCase.execute({
        user_id,
        statement_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to get stamentments operation", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });
    const user_id = String(user.id);

    const statement = await inMemoryStatementsRepository.create({
      amount: 1000,
      description: "Example statement DEPOSIT",
      type: OperationType.DEPOSIT,
      user_id: user_id,
    });
    const statement_id = String(statement.id);

    const getStatementOperation = await getStatementOperationUseCase.execute({
      user_id,
      statement_id,
    });

    expect(getStatementOperation).toEqual(statement);
  });
});

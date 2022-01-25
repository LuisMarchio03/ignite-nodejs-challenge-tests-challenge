import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should not be able to create a user with already exists", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });

      await createUserUseCase.execute({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to create a new user", async () => {
    const userCreate = await createUserUseCase.execute({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });

    expect(userCreate).toHaveProperty("id");
  });
});

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("Authenticate user ", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUsersRepository
    );
  });

  it("should not be able to authenticated user with does not exists", async () => {
    expect(async () => {
      const email = "user_does_not_exists@email.com";
      const password = "123675778";
      await authenticateUserUseCase.execute({ email, password });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticated user with email incorrect", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });
      const email = "incorrect@email.com";
      const password = "123456";

      await authenticateUserUseCase.execute({
        email,
        password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticated user with password incorrect", async () => {
    expect(async () => {
      await inMemoryUsersRepository.create({
        name: "User Example",
        email: "example@email.com",
        password: "123456",
      });
      const email = "example@email.com";
      const password = "888999";

      await authenticateUserUseCase.execute({
        email,
        password,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to authenticated user", async () => {
    const user = await createUserUseCase.execute({
      name: "User Test",
      email: "user@example.com",
      password: "123456",
    });

    const response = await authenticateUserUseCase.execute({
      email: "user@example.com",
      password: "123456",
    });

    expect(response).toHaveProperty("token");
    expect(response.user.id).toBe(user.id);
  });
});

import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: IUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show user profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("should not be able view user profile user with already exists", async () => {
    expect(async () => {
      const user_id = "123";
      await showUserProfileUseCase.execute(user_id);
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should be able view user profile", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "User Example",
      email: "example@email.com",
      password: "123456",
    });
    const user_id = String(user.id);

    const showProfile = await showUserProfileUseCase.execute(user_id);

    expect(showProfile).toEqual(user);
  });
});

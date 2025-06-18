export class LoginAuthDto {
  @NotNull()
  @IsString()
  username: string;
  @
  password: string;
}

import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { UserModel } from "../models/UserModel";
import dotenv from "dotenv"
import { User } from "../types/types";
import { UniqueConstraintError } from 'sequelize';
import { CustomError } from "../types/types";

dotenv.config();

const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY as string;
export class UserService {
    static async signUp(body: User): Promise<object> {
      try {
        const { firstName, lastName, password, email } = body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ firstName, lastName, email, password: hashedPassword });
        const token = jwt.sign({ userId: user.id }, JWT_SECRET_KEY, { expiresIn: '1h' });
  
        const userWithoutPassword = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        };
        return { token, user: userWithoutPassword };
      } catch (error) {    
        if (error instanceof UniqueConstraintError) {
            throw  new CustomError('User with this email already exists', 409);
          }
          console.error(error)
          throw new CustomError('Error creating user', 500);        
      }
    }

    static async login(email: string, password: string): Promise<{ findUser: User; token: string }> {
        try {
            const findUser = await this.findUserByEmail(email);
            if (!findUser) {
                throw new CustomError("User does not exist in our records. Please sign up", 400);
            }    
            const isPasswordValid = await this.comparePassword(password, findUser.password);
            if (!isPasswordValid) {
                throw new CustomError("Incorrect Password", 401);
            }    
            const token = jwt.sign({ userId: findUser.id }, JWT_SECRET_KEY, { expiresIn: '1h' });

            return { findUser, token };
        } catch (error) {
            throw error;
        }
    }

    static async findUserByEmail(email: string): Promise<User | null> {
        try {
          const user = await UserModel.findOne({ where: { email } });
          return user;
        } catch (error) {
          console.error(error);
          throw new CustomError("Error finding user", 500 );
        }
      }

      static async comparePassword(password: string, dbPassword: string) {

        const isPasswordValid = await bcrypt.compare(password, dbPassword);
        if (!isPasswordValid) {
            throw new CustomError("Incorrect Password", 401)
        }
        return true;
      }

  }
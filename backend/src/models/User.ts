import mongoose, { Document } from "mongoose";

// Interface pour le document User
interface IUser extends Document {
  email: string;
  password: string;
}

// Schéma Mongoose avec les types TypeScript
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Export du modèle typé
export default mongoose.model<IUser>("User", userSchema);

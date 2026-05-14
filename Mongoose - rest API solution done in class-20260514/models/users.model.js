export default (mongoose) => {
  const userSchema = new mongoose.Schema(
    {
      email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
      },
      password: { 
        type: String,
        required: [true, "Password is required"] },
    role: {
        type: String,
        enum: ["regular", "admin"],
        default: "regular" },
    },
    {
      timestamps: false,
    },
  );

  return mongoose.model("User", userSchema);
};

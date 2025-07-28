exports.User = class User {
  constructor(id, email, password, username, createdAt, updatedAt) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.username = username;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static async create(user) {
    const { id, email, password, username, createdAt, updatedAt } = user;
    const user = new User(id, email, password, username, createdAt, updatedAt);
    return user;
  }

  static async findById(id) {
    const user = await User.findOne({ where: { id } });
    return user;
  }
};

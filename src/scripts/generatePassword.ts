import bcrypt from "bcryptjs";

if (import.meta.url === `file://${process.argv[1]}`) {
	const password = process.argv[2];
	if (!password) {
		console.error("Password is required");
		process.exit(1);
	}
	const hashedPassword = await bcrypt.hash(password, 10);
	console.log(hashedPassword);
}

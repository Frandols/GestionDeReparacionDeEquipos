import db from "@/db/drizzle";
import { clients } from "@/db/schema";

export interface ClientData {
  id?: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phoneNumber: string;
}

export class Client {
  id?: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phoneNumber: string;

  private constructor(params: ClientData) {
    this.id = params.id;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.dni = params.dni;
    this.email = params.email;
    this.phoneNumber = params.phoneNumber;
  }

  static create(params: Partial<ClientData>): Client | Error {
    if (!params.firstName || params.firstName.trim() === "") {
      return new Error("First name is required.");
    }
    if (!params.lastName || params.lastName.trim() === "") {
      return new Error("Last name is required.");
    }
    if (!params.dni || params.dni.trim() === "") {
      return new Error("DNI is required.");
    }
    if (!params.email || !Client.isValidEmail(params.email)) {
      return new Error("Valid email is required.");
    }
    if (!params.phoneNumber || params.phoneNumber.trim() === "") {
      return new Error("Phone number is required.");
    }

    return new Client(params as ClientData);
  }

  private static isValidEmail(email: string): boolean {
    // Very basic email check
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  public async save() {
    try {
      const result = await db
        .insert(clients)
        .values({
          firstName: this.firstName,
          lastName: this.lastName,
          dni: this.dni,
          email: this.email,
          phoneNumber: this.phoneNumber,
        })
        .returning({ id: clients.id });

      this.id = result[0].id;
      return { success: true };
    } catch (error: any) {
      if (error.code === "23505") {
        return { success: false, reason: "DNI_ALREADY_EXISTS" };
      }
      console.error("Unexpected DB error:", error);
      return { success: false, reason: "UNKNOWN_ERROR" };
    }
  }

  static async getByDni(dni: string): Promise<Client | null> {
    const result = await db
      .select()
      .from(clients)
      .where(clients.dni.eq(dni))
      .limit(1);

    if (result.length === 0) {
      return null;
    }

    const clientData = result[0];
    return new Client(clientData);
  }

  static async getAll(): Promise<Client[]> {
    const result = await db.select().from(clients);
    console.log(result);
    return result.map((clientData) => new Client(clientData));
  }
}

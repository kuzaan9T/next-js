"use server";

export type FormState = {
  error?: string;
  message?: string;
};

export async function submitEmail(prevState: FormState, formData: FormData): Promise<FormState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email) {
    return { error: "Email is required" };
  }

  console.log("Email submitted:", email);
  return { message: "Thanks for submitting!" };
}

export async function submitPassword(prevState: FormState, formData: FormData): Promise<FormState> {
  const password = String(formData.get("password") ?? "");

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" };
  }

  return { message: "Password accepted!" };
}

export async function submitName(prevState: FormState, formData: FormData): Promise<FormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();

  if (!firstName || !lastName) {
    return { error: "Please enter both first and last name" };
  }

  return { message: `Hello, ${firstName} ${lastName}!` };
}

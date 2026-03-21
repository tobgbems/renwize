import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { getSupabaseAdmin } from "@/lib/supabase";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth",
  },
  providers: [
    Credentials({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const supabaseAdmin = getSupabaseAdmin();
        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password;

        if (!email || !password) {
          throw new Error("Please enter your email and password.");
        }

        const { data: user, error } = await supabaseAdmin
          .from("users")
          .select("id, name, email, password_hash")
          .eq("email", email)
          .single();

        if (error || !user) {
          throw new Error("Invalid email or password.");
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
          throw new Error("Invalid email or password.");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    authorized({ auth, request }) {
      const isDashboardRoute = request.nextUrl.pathname.startsWith("/dashboard");
      if (isDashboardRoute) {
        return !!auth;
      }
      return true;
    },
    async signIn({ user, account }) {
      if (account?.provider === "google" && user?.email) {
        const supabaseAdmin = getSupabaseAdmin();
        // Ensure Google users also exist in our app table.
        await supabaseAdmin.from("users").upsert(
          {
            email: user.email.toLowerCase(),
            name: user.name || user.email.split("@")[0],
          },
          { onConflict: "email" },
        );
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
});

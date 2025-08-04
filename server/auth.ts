// <AdminAuthenticationSystemSnippet>
// This file handles all the security for the admin area
// Think of it like a security guard at a VIP entrance - it checks who's allowed in

import bcrypt from 'bcryptjs';
import { Request, Response, NextFunction } from 'express';
import { storage } from './storage';

// <SessionUserTypeSnippet>
// This tells TypeScript what information we store about logged-in users
// It's like a badge that shows who someone is when they're inside
declare module 'express-session' {
  interface SessionData {
    user?: {
      id: number;
      username: string;
      isAdmin: boolean;
    };
    client?: {
      id: number;
      companyName: string;
      accessCode: string;
    };
  }
}
// </SessionUserTypeSnippet>

// <PasswordHelperSnippet>
// These functions handle passwords safely
// Like a bank vault - they lock passwords so no one can read them

// This function takes a password and scrambles it up
// Like turning "password123" into "$2a$10$xyzabc..." (unreadable)
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10; // How many times to scramble (more = safer but slower)
  return bcrypt.hash(password, saltRounds);
}

// This function checks if a password is correct
// Like checking if a key fits in a lock
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
// </PasswordHelperSnippet>

// <AuthMiddlewareSnippet>
// This is the security guard that checks if someone is allowed in the admin area
// It runs before any admin page loads
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // <CheckIfLoggedInSnippet>
  // First, check if anyone is logged in at all
  if (!req.session.user) {
    // No one is logged in - send them to the login page
    return res.status(401).json({ 
      success: false, 
      message: "Please log in to access this area" 
    });
  }
  // </CheckIfLoggedInSnippet>

  // <CheckIfAdminSnippet>
  // They're logged in, but are they an admin?
  if (!req.session.user.isAdmin) {
    // They're logged in but not an admin - like having a regular ticket at a VIP event
    return res.status(403).json({ 
      success: false, 
      message: "You don't have permission to access this area" 
    });
  }
  // </CheckIfAdminSnippet>

  // They're logged in AND they're an admin - let them through!
  next();
}
// </AuthMiddlewareSnippet>

// <LoginFunctionSnippet>
// This function handles the login process
// Like checking someone's ID at the door
export async function loginAdmin(username: string, password: string, req: Request): Promise<{ success: boolean; message: string; user?: any }> {
  try {
    // <FindUserSnippet>
    // Look up the username in our database
    // Like looking for someone's name on the guest list
    const user = await storage.getUserByUsername(username);
    
    if (!user) {
      // Username not found - like the name isn't on the list
      return { 
        success: false, 
        message: "Invalid username or password" 
      };
    }
    // </FindUserSnippet>

    // <CheckPasswordSnippet>
    // Check if their password is correct
    // Like checking if their ID photo matches their face
    const isPasswordValid = await verifyPassword(password, user.password);
    
    if (!isPasswordValid) {
      // Wrong password - like showing a fake ID
      return { 
        success: false, 
        message: "Invalid username or password" 
      };
    }
    // </CheckPasswordSnippet>

    // <CheckAdminStatusSnippet>
    // Check if they're actually an admin
    // Like checking if they have a VIP badge
    if (!user.isAdmin) {
      // They have valid login but aren't an admin
      return { 
        success: false, 
        message: "You don't have admin access" 
      };
    }
    // </CheckAdminStatusSnippet>

    // <SaveSessionSnippet>
    // Everything checks out! Save their info in the session
    // Like giving them a wristband that shows they're allowed in
    req.session.user = {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    };
    // </SaveSessionSnippet>

    return { 
      success: true, 
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username
      }
    };
  } catch (error) {
    console.error('Login error:', error);
    return { 
      success: false, 
      message: "An error occurred during login" 
    };
  }
}
// </LoginFunctionSnippet>

// <LogoutFunctionSnippet>
// This function logs someone out
// Like taking their wristband when they leave
export function logoutAdmin(req: Request): Promise<void> {
  return new Promise((resolve, reject) => {
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
// </LogoutFunctionSnippet>
// </AdminAuthenticationSystemSnippet>
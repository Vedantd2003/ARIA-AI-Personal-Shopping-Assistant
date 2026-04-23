import { User } from '@/types'

// In-memory store — replace with a real DB (Postgres, MongoDB) in production
const users = new Map<string, User>()

export function findUserByEmail(email: string): User | undefined {
  return Array.from(users.values()).find(
    (u) => u.email.toLowerCase() === email.toLowerCase()
  )
}

export function findUserById(id: string): User | undefined {
  return users.get(id)
}

export function createUser(user: User): User {
  users.set(user.id, user)
  return user
}

export function updateUser(id: string, updates: Partial<User>): User | undefined {
  const user = users.get(id)
  if (!user) return undefined
  const updated = { ...user, ...updates }
  users.set(id, updated)
  return updated
}

import type { AccessArgs } from 'payload'
import type { User } from '@/payload-types'

type IsClient = (args: AccessArgs<User>) => boolean

export const isClient: IsClient = ({ req: { user } }) => {
  return Boolean(user?.role === 'client')
}
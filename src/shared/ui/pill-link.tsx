

import Link from 'next/link'
import { PillButton } from './button'
import type { ComponentProps } from 'react'

type PillLinkProps = ComponentProps<typeof PillButton> & { href: string }

export function PillLink({ href, children, ...props }: PillLinkProps) {
  return (
    <Link href={href} style={{ display: 'contents' }}>
      <PillButton {...props}>{children}</PillButton>
    </Link>
  )
}


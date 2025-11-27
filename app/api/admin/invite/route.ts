import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/auth'
import { getFirestoreDb } from '@/lib/firebase-admin'
import nodemailer from 'nodemailer'
import type { AdminUser } from '@/types/admin'

export async function POST(req: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Only super admins can invite
    if (session.user.role !== 'super_admin' && !session.user.permissions.manageAdmins) {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 })
    }

    const { email, name, role, permissions } = await req.json()

    if (!email || !name || !role) {
      return NextResponse.json(
        { error: 'Email, name, and role are required' },
        { status: 400 }
      )
    }

    const db = getFirestoreDb()

    // Check if user already exists
    const existingUser = await db.collection('admins').doc(email).get()
    if (existingUser.exists) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      )
    }

    // Create admin user
    const newAdmin: AdminUser = {
      email,
      name,
      role,
      permissions,
      status: 'pending',
      invitedBy: session.user.email,
      createdAt: new Date(),
      lastLoginAt: new Date(),
    }

    await db.collection('admins').doc(email).set(newAdmin)

    // Send invitation email
    if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_APP_PASSWORD,
        },
      })

      const loginUrl = `${process.env.NEXTAUTH_URL}/admin/login`

      await transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: '🎉 You\'ve been invited to NRI Wealth Partners Admin',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px;">
            <h2 style="color: #1e3a8a;">Welcome to NRI Wealth Partners Admin!</h2>

            <p>Hi ${name},</p>

            <p>${session.user.name} has invited you to join the NRI Wealth Partners admin team as a <strong>${role.replace('_', ' ')}</strong>.</p>

            <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Your Access Details:</h3>
              <p><strong>Role:</strong> ${role.replace('_', ' ')}</p>
              <p><strong>Permissions:</strong></p>
              <ul>
                ${Object.entries(permissions)
                  .filter(([_, value]) => value)
                  .map(([key]) => `<li>${key.replace(/([A-Z])/g, ' $1').trim()}</li>`)
                  .join('')}
              </ul>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${loginUrl}" style="background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
                Login to Admin Portal
              </a>
            </div>

            <p style="color: #666; font-size: 14px;">
              Login URL: <a href="${loginUrl}">${loginUrl}</a>
            </p>

            <p style="color: #666; font-size: 14px;">
              Use your email address (${email}) to sign in with Google.
            </p>

            <hr style="margin: 30px 0;">
            <p style="color: #666; font-size: 12px;">
              If you didn't expect this invitation, please contact ${session.user.email}
            </p>
          </div>
        `,
      })

      console.log(`✅ Invitation sent to ${email}`)
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation sent successfully'
    })

  } catch (error: any) {
    console.error('Admin invite error:', error)
    return NextResponse.json(
      { error: 'Failed to send invitation', details: error.message },
      { status: 500 }
    )
  }
}

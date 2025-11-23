import { NextResponse } from "next/server"

interface WebinarRegistrationData {
  name: string
  email: string
  phone: string
  country: string
  webinarId: string
  webinarTitle: string
  webinarDate: string
  webinarTime: string
}

export async function POST(request: Request) {
  try {
    const data: WebinarRegistrationData = await request.json()

    // Validate required fields
    if (!data.name || !data.email || !data.webinarId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Email configuration - check which service is available
    const gmailUser = process.env.GMAIL_USER
    const gmailPassword = process.env.GMAIL_APP_PASSWORD
    const resendApiKey = process.env.RESEND_API_KEY
    const contactEmail = process.env.CONTACT_EMAIL || "support@nriwealthpartners.com"

    let emailSent = false

    // Try Resend first if API key is available
    if (resendApiKey) {
      try {
        const { Resend } = await import("resend")
        const resend = new Resend(resendApiKey)

        // Send confirmation email to user
        await resend.emails.send({
          from: "NRI Wealth Partners <noreply@nriwealthpartners.com>",
          to: data.email,
          subject: `Webinar Registration Confirmed: ${data.webinarTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e3a8a;">Webinar Registration Confirmed</h2>
              <p>Dear ${data.name},</p>
              <p>Thank you for registering for our webinar!</p>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e3a8a; margin-top: 0;">${data.webinarTitle}</h3>
                <p><strong>Date:</strong> ${data.webinarDate}</p>
                <p><strong>Time:</strong> ${data.webinarTime}</p>
              </div>

              <p>We'll send you the webinar link 24 hours before the event.</p>

              <p>If you have any questions, feel free to contact us at ${contactEmail}</p>

              <p>Looking forward to seeing you there!</p>

              <p>Best regards,<br>
              <strong>NRI Wealth Partners Team</strong></p>
            </div>
          `,
        })

        // Send notification to admin
        await resend.emails.send({
          from: "NRI Wealth Partners <noreply@nriwealthpartners.com>",
          to: contactEmail,
          subject: `New Webinar Registration: ${data.webinarTitle}`,
          html: `
            <h2>New Webinar Registration</h2>
            <p><strong>Webinar:</strong> ${data.webinarTitle}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Country:</strong> ${data.country || "Not provided"}</p>
            <p><strong>Date:</strong> ${data.webinarDate}</p>
            <p><strong>Time:</strong> ${data.webinarTime}</p>
          `,
        })

        emailSent = true
      } catch (resendError) {
        console.error("Resend error:", resendError)
      }
    }

    // Fallback to Gmail SMTP if Resend failed or not configured
    if (!emailSent && gmailUser && gmailPassword) {
      try {
        const nodemailer = await import("nodemailer")
        const transporter = nodemailer.default.createTransport({
          service: "gmail",
          auth: {
            user: gmailUser,
            pass: gmailPassword,
          },
        })

        // Send confirmation email to user
        await transporter.sendMail({
          from: `"NRI Wealth Partners" <${gmailUser}>`,
          to: data.email,
          subject: `Webinar Registration Confirmed: ${data.webinarTitle}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #1e3a8a;">Webinar Registration Confirmed</h2>
              <p>Dear ${data.name},</p>
              <p>Thank you for registering for our webinar!</p>

              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #1e3a8a; margin-top: 0;">${data.webinarTitle}</h3>
                <p><strong>Date:</strong> ${data.webinarDate}</p>
                <p><strong>Time:</strong> ${data.webinarTime}</p>
              </div>

              <p>We'll send you the webinar link 24 hours before the event.</p>

              <p>If you have any questions, feel free to contact us at ${contactEmail}</p>

              <p>Looking forward to seeing you there!</p>

              <p>Best regards,<br>
              <strong>NRI Wealth Partners Team</strong></p>
            </div>
          `,
        })

        // Send notification to admin
        await transporter.sendMail({
          from: `"NRI Wealth Partners" <${gmailUser}>`,
          to: contactEmail,
          subject: `New Webinar Registration: ${data.webinarTitle}`,
          html: `
            <h2>New Webinar Registration</h2>
            <p><strong>Webinar:</strong> ${data.webinarTitle}</p>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
            <p><strong>Country:</strong> ${data.country || "Not provided"}</p>
            <p><strong>Date:</strong> ${data.webinarDate}</p>
            <p><strong>Time:</strong> ${data.webinarTime}</p>
          `,
        })

        emailSent = true
      } catch (gmailError) {
        console.error("Gmail error:", gmailError)
      }
    }

    if (!emailSent) {
      // Log the registration even if email fails
      console.log("Webinar registration (email not sent):", data)
    }

    return NextResponse.json({
      message: "Registration successful! Check your email for confirmation.",
      success: true,
    })
  } catch (error) {
    console.error("Webinar registration error:", error)
    return NextResponse.json(
      { error: "Failed to process registration. Please try again." },
      { status: 500 }
    )
  }
}

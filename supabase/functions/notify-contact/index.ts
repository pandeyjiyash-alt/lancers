// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "@supabase/functions-js/edge-runtime.d.ts"
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts"

console.log("Notify Contact Function is running")

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 })
  }

  try {
    const body = await req.json()
    const { subject, payload: formData } = body

    const smtpHost = Deno.env.get("SMTP_HOST")
    const smtpPort = parseInt(Deno.env.get("SMTP_PORT") || "587")
    const smtpUser = Deno.env.get("SMTP_USER")
    const smtpPassword = Deno.env.get("SMTP_PASSWORD")
    const smtpFrom = Deno.env.get("SMTP_FROM")
    const notifyEmail = Deno.env.get("NOTIFY_EMAIL")

    if (!smtpHost || !smtpUser || !smtpPassword || !smtpFrom || !notifyEmail) {
      return new Response(
        JSON.stringify({ error: "Missing SMTP environment variables" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      )
    }

    const client = new SmtpClient()
    await client.connect({
      hostname: smtpHost,
      port: smtpPort,
      username: smtpUser,
      password: smtpPassword,
      tls: true,
    })

    const htmlBody = `
      <h1>New contact form submission</h1>
      <p><strong>Name:</strong> ${formData.name}</p>
      <p><strong>Mobile:</strong> ${formData.mobile}</p>
      <p><strong>Email:</strong> ${formData.email || "N/A"}</p>
      <p><strong>Technology:</strong> ${formData.technology}</p>
      <p><strong>Message:</strong> ${formData.message || "No message provided"}</p>
    `

    await client.send({
      from: smtpFrom,
      to: notifyEmail,
      subject: subject || "New contact form submission",
      content: htmlBody,
      mimeType: "text/html",
    })

    await client.close()

    return new Response(
      JSON.stringify({ status: "ok", message: "Email sent successfully" }),
      { headers: { "Content-Type": "application/json" } }
    )
  } catch (error) {
    console.error("Error sending email:", error.message)
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    )
  }
})

/* To invoke locally:

  1. Set environment variables (create .env.local):
     SMTP_HOST=smtp.gmail.com
     SMTP_PORT=587
     SMTP_USER=your-email@gmail.com
     SMTP_PASSWORD=your-app-password
     SMTP_FROM=your-email@gmail.com
     NOTIFY_EMAIL=your-email@gmail.com

  2. Run `supabase start`
  3. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/notify-contact' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"subject":"Test Email","payload":{"name":"John","mobile":"1234567890","email":"john@example.com","technology":"react","message":"Test message"}}'

*/

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

const supabaseUrl = "https://ahhmhdwukqfquwodeunc.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoaG1oZHd1a3FmcXV3b2RldW5jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU1NzQxODQsImV4cCI6MjA3MTE1MDE4NH0.PlBMneWa9STztSgb3VeqlTP6gBvFyW-wc43uFAQmtdA"
const supabase = createClient(supabaseUrl, supabaseKey)

document.getElementById("punchlistForm").addEventListener("submit", async (e) => {
  e.preventDefault()

  const description = document.getElementById("description").value
  const requester = document.getElementById("requester").value
  const requestDate = document.getElementById("requestDate").value
  const assignee = document.getElementById("assignee").value
  const file = document.getElementById("evidence").files[0]

  let evidenceUrl = null

  if (file) {
    const fileName = `${Date.now()}_${file.name}`
    const { data, error } = await supabase.storage
      .from("evidence")
      .upload(fileName, file)

    if (error) {
      console.error("Upload error:", error.message)
      alert("Failed to upload image")
      return
    }

    // dapatkan public URL
    const { data: publicUrl } = supabase
      .storage
      .from("evidence")
      .getPublicUrl(fileName)

    evidenceUrl = publicUrl.publicUrl
  }

  // simpan ke tabel punchlist
  const { error: insertError } = await supabase.from("punchlist").insert([
    {
      description,
      requester,
      request_date: requestDate,
      assignee,
      evidence_url: evidenceUrl,
      status: "On Process"
    }
  ])

  if (insertError) {
    console.error(insertError)
    alert("Failed to save punchlist")
  } else {
    alert("Punchlist submitted successfully!")
    e.target.reset()
  }
})

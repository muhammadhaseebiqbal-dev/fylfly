import { NextRequest, NextResponse } from "next/server";
import axios from 'axios'

export const runtime = 'nodejs'
export const maxDuration = 300
export const config = {
  api: {
    bodyParser: {
        sizeLimit: '5gb'
    },
    responseLimit: false,
  },
};


export async function POST(req: NextRequest) {

    const data = await req.formData()
    const file = data.get('file') as File

    const payload = new FormData()
    payload.append('file', file)

    const response = await axios.post('https://upload.gofile.io/uploadfile', payload, {
        headers: {
            'Authorization': `Bearer ${process.env.GOFILE_API_TOKEN}`,
            'Content-Type': 'multipart/form-data'
        }
    })

    const parsedResponse = response.data.data
    const server = parsedResponse.servers[0]
    const fileId = parsedResponse.id
    const filename = encodeURIComponent(parsedResponse.name)

    const directLink = `https://${server}.gofile.io/download/${fileId}/${filename}`

    return NextResponse.json({
        success: true,
        directLink: directLink,
        message: "File Uploaded Successfully!"
    }, { status: 200 })
}
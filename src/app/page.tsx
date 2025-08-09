"use client"

import { CheckCircle, CopyIcon, UploadCloud, XIcon } from "lucide-react";
import { FaWhatsapp, FaTelegram, FaSlack } from "react-icons/fa";
import { useRef, useState } from "react";
import '@/app/globals.css'
import axios, { AxiosProgressEvent } from "axios";
import { motion, AnimatePresence } from "motion/react";
import { SiSignal } from "react-icons/si";


export default function Home() {
  const fileInput = useRef<HTMLInputElement>(null)
  const [dragOver, isDragOver] = useState<boolean>()
  const [uploading, isUploading] = useState<boolean>(false)
  const [progress, setProgress] = useState<number>(0)
  const [engagementTitle, setEngagementTitle] = useState<string>("")
  const [directLink, setDirectlink] = useState<string>("https://${server}.gofile.io/download/${fileId}/${filename}")
  const [copied, iscopied] = useState<boolean>(false)
  const [popup, isPopup] = useState<boolean>(false)


  // Backend interactions
  const propagateFileToBackend = async (file: File) => {
    const payload = new FormData()
    const MAX_FILE_SIZE = 5 * 1024 * 1024 * 1024
    payload.append('file', file)

    try {
      if (file) {
        await axios.post('/api', payload, {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          timeout: 300000, // 5 minutes timeout
          maxContentLength: MAX_FILE_SIZE,
          maxBodyLength: MAX_FILE_SIZE,

          onUploadProgress: (ProgressEvent: AxiosProgressEvent) => {
            if (ProgressEvent.total) {
              const percent = Math.round((ProgressEvent.loaded * 100) / ProgressEvent.total)
              setProgress(percent)
              if (percent >= 100) {
                setEngagementTitle("Finishing up the process")
              } else{
                setEngagementTitle("validating file for added security layer")
              }
            }
          }
        }
        )
          .then(response => {
            setEngagementTitle("")
            setProgress(0)
            isUploading(false)
            console.log(response.data.directLink);
            
            setDirectlink(response.data?.directLink)
            isPopup(true)
            console.log(response.data)
          })
      }
    } catch (error) {
      console.log("Error encountered:", error);
      setEngagementTitle("")
      setProgress(0)
      isUploading(false)
    }
  }

  // Handlers
  const OpenSelector = () => {
    fileInput.current?.click()
  }
  const onNormalUpload = () => {
    isDragOver(false)
    isUploading(true)

    const file = fileInput.current?.files?.[0]
    if (file) {
      propagateFileToBackend(file)
    }
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragOver(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragOver(false)
  }
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    isDragOver(false)
    isUploading(true)

    const file = e.dataTransfer.files[0]
    if (file) {
      await propagateFileToBackend(file)
    }
  }
  const copyLinktoClipboard = () => {

    if (!copied) {
      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(directLink)
          .then(() => {
            iscopied(true)
            setTimeout(() => {
              iscopied(false)
            }, 2000)

            navigator.vibrate?.(300)
            console.log("Copied to the clipboard!")
          })
          .catch((err) => {
            console.log("Something went wrong!")
          })
      } else {
        const tempTextArea = document.createElement('textarea')
        tempTextArea.style.position = "fixed"
        document.appendChild(tempTextArea)

        tempTextArea.focus()
        tempTextArea.select()

        try {
          document.execCommand('copy')
          iscopied(true)
          setTimeout(() => {
            iscopied(false)
          }, 2000)

          navigator.vibrate?.(300)
          console.log("Copied to the clipboard!")
        } catch (error) {
          console.log("Something went wrong!")
        }
      }
    } else {
      console.log("Cool down period 2s")
    }

  }
  const handlePopupX = () => {
    isPopup(false)
  }
  const handleWhatsappDeeplink = ()=>{
    const encodedDirectLink = encodeURIComponent(directLink)
    window.open(`https://wa.me/?text=${encodedDirectLink}`, "_blank")
  }
  const handleTelegramDeeplink = ()=>{
    const encodedDirectLink = encodeURIComponent(directLink)
    window.open(`https://t.me/share/url?url=${encodedDirectLink}&text=${encodeURIComponent("Check this out!")}`, "_blank")
  }
  const handleSignalDeeplink = ()=>{
    const encodedDirectLink = encodeURIComponent(directLink)
    window.location.href = `sgnl://send?text=${encodeURIComponent(directLink)}`
  }
  const handleSlackDeeplink = ()=>{
    const encodedDirectLink = encodeURIComponent(directLink)
    window.open(`https://slack.com/app_redirect`, "_blank")
  }


  return (
    <>
      <AnimatePresence>
        {popup &&
          <motion.div
            initial={{ x: 0, y: 0, opacity: 0, scale: 0.8 }}
            animate={{ x: -20, y: -20, opacity: 1, scale: 1 }}
            exit={{ x: 0, y: 0, opacity: 0, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3
            }}
            className="popup w-[95%] h-[70%] lg:h-[75%] lg:w-[60%] absolute top-15 left-7 lg:left-1/2 transform lg:-translate-x-1/2 z-2 rounded-xl"
          >
            <XIcon
              className="absolute right-4 top-4 text-gray-400/70 cursor-pointer" size={40} strokeWidth={3}
              onClick={handlePopupX}
            />
            <div className="w-full h-[90%] absolute bottom-0 p-5 lg:px-16 box-border flex flex-col gap-5">
              <h1 className="text-5xl font-extrabold text-gray-400/70">All Done!</h1>
              <input className="p-3 border-2 text-gray-300 rounded-xl border-gray-400/70 outline-none" type="url" value={directLink} readOnly />
              <button
                type="button"
                className={`${!copied ? 'bg-gray-500/70 hover:bg-gray-600/70' : 'bg-green-400/70 hover:bg-green-500/70'} flex flex-row w-fit p-2 gap-2  rounded-lg transition-all duration-300 cursor-pointer`}
                onClick={copyLinktoClipboard}
              >
                {
                  !copied ?
                    (
                      <>
                        <CopyIcon />
                        <span>Copy Direct Link</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle />
                        <span>Copied</span>
                      </>
                    )
                }
              </button>
              <hr className="border-gray-400/30" />
              <h1 className="text-5xl font-extrabold text-gray-400/70">Share On!</h1>
              <div className="flex flex-wrap justify-between ">
                <div onClick={handleWhatsappDeeplink} className="flex items-center flex-row gap-2 bg-green-700 hover:bg-green-700/70 cursor-pointer py-4 px-6 w-[48%] rounded-lg">
                  <FaWhatsapp size={28} />
                  <span>Whatsapp</span>
                </div>
                <div onClick={handleTelegramDeeplink} className="flex flex-row items-center gap-2 bg-[#0088cc] hover:bg-[#0088ccb9] cursor-pointer py-4 px-6 w-[48%] rounded-lg">
                  <FaTelegram size={28} />
                  <span>Telegram</span>
                </div>
                <div onClick={handleSignalDeeplink} className="flex flex-row items-center gap-2 mt-4 bg-[#3a76f0] hover:bg-[#3a77f0c4] cursor-pointer  py-4 px-6 w-[48%] rounded-lg">
                  <SiSignal size={28} />
                  <span>Signal</span>
                </div>
                <div onClick={handleSlackDeeplink} className="flex flex-row items-center gap-2 mt-4 bg-[#8a168b] hover:bg-[#89168bc8] cursor-pointer py-4 px-6 w-[48%] rounded-lg">
                  <FaSlack size={28} />
                  <span>Slack</span>
                </div>
              </div>
            </div>
          </motion.div>}
      </AnimatePresence>
      <div
        className={`fileUpload relative flex justify-center items-center w-[90%] lg:w-[45%] h-[50%] m-auto mt-32 border-3 border-dashed ${dragOver ? 'border-purple-500' : 'border-gray-700/30'}  rounded-xl`}
        onClick={OpenSelector}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}

        onChange={onNormalUpload}
      >
        <div className="flex flex-col gap-2 items-center text-gray-500">
          {
            !uploading ? (
              <>
                <input type="file" ref={fileInput} hidden={true} />
                <UploadCloud size={100} strokeWidth={2} />
                <span className="text-2xl">Upload a file here</span>
              </>
            ) : (
              <>
                <h1 className="font-extrabold text-6xl">{progress}%</h1>
                <span className="mt-3">{engagementTitle}</span>
              </>
            )
          }
        </div>
      </div>
    </>
  );
}

'use client'

import React from 'react'
import { useState, useRef, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Container from '@mui/material/Container'
import Paper from '@mui/material/Paper'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import { styled } from '@mui/material/styles'
import UploadIcon from '@mui/icons-material/CloudUpload'
import DescriptionIcon from '@mui/icons-material/Description'
import * as pdfjs from 'pdfjs-dist/build/pdf.mjs'
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.mjs'

const UploadPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  border: '2px dashed',
  borderColor: theme.palette.grey[300],
  textAlign: 'center',
  cursor: 'pointer',
  '&:hover': {
    borderColor: theme.palette.grey[400],
  },
}))

const PDFNotesExtractor = () => {
  const [file, setFile] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = URL.createObjectURL(
      new Blob([`importScripts('${pdfjsWorker}'))`],
      { type: 'application/javascript' })
    )
  }, [])

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      setError(null)
      setSuccess(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleDrop = (e) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange({ target: { files: e.dataTransfer.files } })
    }
  }

  const extractAndLogPDFContent = async (file) => {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise
    
    const pdfData = {
      fileName: file.name,
      totalPages: pdf.numPages,
      pages: []
    }

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i)
      const textContent = await page.getTextContent()
      
      const pageData = {
        pageNumber: i,
        elements: textContent.items.map((item, index) => ({
          id: `page${i}_element${index}`,
          text: item.str,
          position: {
            x: item.transform[4],
            y: item.transform[5]
          },
          style: {
            fontSize: item.transform[0],
            fontName: item.fontName
          }
        })),
        rawContent: textContent.items.map(item => item.str).join(' ')
      }

      pdfData.pages.push(pageData)
    }

    // Send the extracted data to the server
    const response = await fetch('http://localhost:5000/studyMaterials', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(pdfData)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    console.log('Data sent successfully to server')
    return await response.json()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!file) return

    setUploading(true)
    setError(null)
    setSuccess(false)

    try {
      await extractAndLogPDFContent(file)
      setSuccess(true)
    } catch (error) {
      console.error('PDF processing failed:', error)
      setError(error.message || 'Failed to process and upload PDF')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            PDF Content Logger
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom className='text-black'>
          Log PDF Elements
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
          <UploadPaper
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <UploadIcon sx={{ fontSize: 48, color: 'grey.500', mb: 2 }} />
            <Typography variant="h6">
              {file ? file.name : 'Click or drag to upload PDF'}
            </Typography>
          </UploadPaper>

          {file && (
            <Box sx={{ mt: 4 }}>
              <Alert
                icon={<DescriptionIcon />}
                severity="info"
                sx={{ alignItems: 'center' }}
              >
                {file.name}
              </Alert>
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mt: 2 }}>
              PDF processed and uploaded successfully!
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={uploading || !file}
            fullWidth
            sx={{ mt: 4 }}
          >
            {uploading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} sx={{ mr: 1 }} />
                Processing...
              </Box>
            ) : (
              'Process PDF'
            )}
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

export default PDFNotesExtractor
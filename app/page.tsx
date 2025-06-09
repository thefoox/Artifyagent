'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  message?: string
  productId?: string
  shopifyId?: string
  shopifyUrl?: string
  mode?: 'DEMO' | 'PRODUCTION'
  metadata?: {
    title: string
    description: string
  }
}

export default function HomePage() {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({ status: 'idle' })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file) {
      setUploadedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
      handleFileUpload(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png', '.tiff'],
      'application/pdf': ['.pdf']
    },
    maxSize: 300 * 1024 * 1024, // 300MB
    multiple: false
  })

  const handleFileUpload = async (file: File) => {
    try {
      setUploadStatus({ status: 'uploading', message: 'Uploading file to storage...' })

      // Step 1: Upload file to Supabase Storage
      const formData = new FormData()
      formData.append('file', file)

      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      const uploadResult = await uploadResponse.json()

      if (!uploadResult.success) {
        throw new Error(uploadResult.error || 'File upload failed')
      }

      console.log('✅ File uploaded to Supabase Storage:', uploadResult.publicUrl)

      setUploadStatus({ status: 'processing', message: 'Creating product variants with Shopify...' })

      // Step 2: Create product using the uploaded file's public URL
      const orchestratorResponse = await fetch('/api/orchestrator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
            publicUrl: uploadResult.publicUrl,
            filename: uploadResult.filename,
            contentType: uploadResult.contentType,
            sizeBytes: uploadResult.sizeBytes
          }
        })
      })

      const result = await orchestratorResponse.json()

      if (result.success) {
        setUploadStatus({
          status: result.status === 'READY' ? 'ready' : 'processing',
          message: result.message || (result.status === 'READY' ? 'Product created successfully!' : 'Product created! Waiting for variants to be ready...'),
          productId: result.productId,
          shopifyId: result.shopifyId,
          shopifyUrl: result.shopifyUrl,
          mode: result.mode,
          metadata: result.metadata
        })

        // Only poll for status if still processing
        if (result.status !== 'READY') {
          pollForStatus(result.productId)
        }
      } else {
        throw new Error(result.error || 'Product creation failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      setUploadStatus({
        status: 'error',
        message: error instanceof Error ? error.message : 'Upload failed'
      })
    }
  }

  const pollForStatus = async (productId: string) => {
    const maxPolls = 30
    let pollCount = 0

    const poll = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
        const data = await response.json()

        if (data.status === 'READY') {
          setUploadStatus(prev => ({
            ...prev,
            status: 'ready',
            message: 'Product and variants are ready!'
          }))
        } else if (pollCount < maxPolls) {
          pollCount++
          setTimeout(poll, 2000)
        } else {
          setUploadStatus(prev => ({
            ...prev,
            status: 'error',
            message: 'Timeout waiting for product to be ready'
          }))
        }
      } catch (error) {
        console.error('Polling error:', error)
        setUploadStatus(prev => ({
          ...prev,
          status: 'error',
          message: 'Error checking product status'
        }))
      }
    }

    poll()
  }

  const resetUpload = () => {
    setUploadStatus({ status: 'idle' })
    setUploadedFile(null)
    setPreviewUrl(null)
  }

  const getStatusIcon = () => {
    switch (uploadStatus.status) {
      case 'uploading':
      case 'processing':
        return <Clock className="w-5 h-5 animate-spin" />
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      default:
        return <Upload className="w-5 h-5" />
    }
  }

  const renderStatus = () => {
    switch (uploadStatus.status) {
      case 'uploading':
        return (
          <div className="text-blue-600">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            {uploadStatus.message}
          </div>
        )
      case 'processing':
        return (
          <div className="text-yellow-600">
            <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"></div>
            {uploadStatus.message}
          </div>
        )
      case 'ready':
        return (
          <div className="text-green-600">
            <div className="space-y-3">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                {uploadStatus.message}
              </div>
              
              {uploadStatus.metadata && (
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="font-medium text-green-800">{uploadStatus.metadata.title}</p>
                  <p className="text-green-600 text-sm mt-1">{uploadStatus.metadata.description}</p>
                </div>
              )}
              
              <div className="space-y-2 text-sm">
                {uploadStatus.productId && (
                  <p><span className="font-medium">Product ID:</span> {uploadStatus.productId}</p>
                )}
                {uploadStatus.shopifyId && (
                  <p><span className="font-medium">Shopify ID:</span> {uploadStatus.shopifyId}</p>
                )}
                {uploadStatus.mode && (
                  <p><span className="font-medium">Mode:</span> {uploadStatus.mode}</p>
                )}
                {uploadStatus.shopifyUrl && (
                  <a 
                    href={uploadStatus.shopifyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800"
                  >
                    View in Shopify Admin
                    <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        )
      case 'error':
        return (
          <div className="text-red-600">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {uploadStatus.message}
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          AI-Powered Print Automation
        </h1>
        <p className="text-xl text-gray-600 mb-6">
          Upload your artwork and watch as AI creates multiple product variants automatically
        </p>
        <div className="flex justify-center space-x-4 text-sm text-gray-500">
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            Multiple Size Variants
          </span>
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            AI-Generated Metadata
          </span>
          <span className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
            Shopify Integration
          </span>
        </div>
      </div>

      {/* Upload Area */}
      <div className="card mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
            }`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center">
            <div className="mb-4">
              {previewUrl ? (
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="w-32 h-32 object-cover rounded-lg shadow-md"
                />
              ) : (
                <Image className="w-16 h-16 text-gray-400" />
              )}
            </div>
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop your artwork here...</p>
            ) : (
              <>
                <p className="text-lg text-gray-700 mb-2">
                  Drag & drop your artwork, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports JPG, PNG, TIFF, PDF • Max 300MB • Min 300 DPI recommended
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Status Display */}
      {uploadStatus.status !== 'idle' && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center">
              {getStatusIcon()}
              <span className="ml-2">Upload Status</span>
            </h3>
            {uploadStatus.status === 'ready' || uploadStatus.status === 'error' ? (
              <button onClick={resetUpload} className="btn btn-secondary">
                Upload Another
              </button>
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Status:</span>
              <span className={`status-badge status-${uploadStatus.status}`}>
                {uploadStatus.status.toUpperCase()}
              </span>
            </div>

            {uploadStatus.mode && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mode:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  uploadStatus.mode === 'DEMO' 
                    ? 'bg-yellow-100 text-yellow-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {uploadStatus.mode}
                </span>
              </div>
            )}

            {uploadStatus.message && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Message:</span>
                <span className="text-gray-900">{uploadStatus.message}</span>
              </div>
            )}

            {uploadStatus.productId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Product ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {uploadStatus.productId}
                </code>
              </div>
            )}

            {uploadStatus.shopifyId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shopify ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {uploadStatus.shopifyId}
                </code>
              </div>
            )}
          </div>

          {/* AI-Generated Metadata */}
          {uploadStatus.metadata && (
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3">AI-Generated Metadata</h4>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-blue-800">Title:</span>
                  <span className="ml-2 text-blue-700">{uploadStatus.metadata.title}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-800">Description:</span>
                  <p className="ml-2 text-blue-700 mt-1">{uploadStatus.metadata.description}</p>
                </div>
              </div>
            </div>
          )}

          {/* Success Actions */}
          {uploadStatus.status === 'ready' && uploadStatus.shopifyUrl && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h4 className="font-semibold text-green-800">Product Created Successfully!</h4>
              </div>
              <p className="text-green-700 text-sm mb-4">
                Your artwork has been processed and product variants have been created in Shopify.
              </p>
              <a
                href={uploadStatus.shopifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                View Product in Shopify
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-6 mt-12">
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Upload className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Easy Upload</h3>
          <p className="text-gray-600 text-sm">
            Simply drag and drop your artwork files. We support multiple formats and large files.
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">AI Processing</h3>
          <p className="text-gray-600 text-sm">
            Our AI analyzes your artwork and generates product titles, descriptions, and variants.
          </p>
        </div>
        
        <div className="text-center p-6">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <Image className="w-6 h-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Auto Variants</h3>
          <p className="text-gray-600 text-sm">
            Multiple product sizes and variations are created automatically in your Shopify store.
          </p>
        </div>
      </div>
    </div>
  )
}
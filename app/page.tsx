'use client'

import React, { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image, CheckCircle, AlertCircle, Clock } from 'lucide-react'

interface UploadStatus {
  status: 'idle' | 'uploading' | 'processing' | 'ready' | 'error'
  message?: string
  productId?: string
<<<<<<< HEAD
  shopifyId?: string
  shopifyUrl?: string
=======
  gelatoId?: string
>>>>>>> dededd1 (Please p)
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
<<<<<<< HEAD
      handleFileUpload(file)
=======
      handleUpload(file)
>>>>>>> dededd1 (Please p)
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

<<<<<<< HEAD
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
=======
  const handleUpload = async (file: File) => {
    try {
      setUploadStatus({ status: 'uploading', message: 'Uploading file...' })

      // In a real implementation, you'd upload to Supabase Storage first
      // For demo, we'll simulate with a public URL
      const mockPublicUrl = `https://cdn.example.com/${file.name}`

      setUploadStatus({ status: 'processing', message: 'Creating product variants...' })

      // Call the orchestrator Edge Function
      const response = await fetch('/api/orchestrator', {
>>>>>>> dededd1 (Please p)
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file: {
<<<<<<< HEAD
            publicUrl: uploadResult.publicUrl,
            filename: uploadResult.filename,
            contentType: uploadResult.contentType,
            sizeBytes: uploadResult.sizeBytes
=======
            publicUrl: mockPublicUrl,
            filename: file.name,
            contentType: file.type,
            sizeBytes: file.size
>>>>>>> dededd1 (Please p)
          }
        })
      })

<<<<<<< HEAD
      const result = await orchestratorResponse.json()
=======
      const result = await response.json()
>>>>>>> dededd1 (Please p)

      if (result.success) {
        setUploadStatus({
          status: result.status === 'READY' ? 'ready' : 'processing',
<<<<<<< HEAD
          message: result.message || (result.status === 'READY' ? 'Product created successfully!' : 'Product created! Waiting for variants to be ready...'),
          productId: result.productId,
          shopifyId: result.shopifyId,
          shopifyUrl: result.shopifyUrl,
=======
          message: result.status === 'READY' ? 'Product created successfully!' : 'Product created! Waiting for variants to be ready...',
          productId: result.productId,
          gelatoId: result.gelatoId,
>>>>>>> dededd1 (Please p)
          mode: result.mode,
          metadata: result.metadata
        })

        // Only poll for status if still processing
        if (result.status !== 'READY') {
          pollForStatus(result.productId)
        }
      } else {
<<<<<<< HEAD
        throw new Error(result.error || 'Product creation failed')
=======
        throw new Error(result.error || 'Upload failed')
>>>>>>> dededd1 (Please p)
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
<<<<<<< HEAD
    const maxPolls = 30
    let pollCount = 0
=======
    const maxAttempts = 30
    let attempts = 0
>>>>>>> dededd1 (Please p)

    const poll = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`)
<<<<<<< HEAD
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
=======
        const product = await response.json()

        if (product.status === 'READY') {
          setUploadStatus({
            status: 'ready',
            message: 'Product ready! All variants created successfully.',
            productId,
            gelatoId: product.gelato_id,
            metadata: uploadStatus.metadata
          })
          return
        }

        if (product.status === 'ERROR') {
          setUploadStatus({
            status: 'error',
            message: 'Product creation failed. Please try again.'
          })
          return
        }

        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000) // Poll every 2 seconds
        } else {
          setUploadStatus({
            status: 'error',
            message: 'Timeout waiting for product to be ready.'
          })
        }
      } catch (error) {
        console.error('Polling error:', error)
        attempts++
        if (attempts < maxAttempts) {
          setTimeout(poll, 2000)
        }
>>>>>>> dededd1 (Please p)
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

<<<<<<< HEAD
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

=======
>>>>>>> dededd1 (Please p)
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
<<<<<<< HEAD
            Shopify Integration
=======
            Gelato Integration
>>>>>>> dededd1 (Please p)
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

<<<<<<< HEAD
            {uploadStatus.shopifyId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Shopify ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {uploadStatus.shopifyId}
=======
            {uploadStatus.gelatoId && (
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Gelato ID:</span>
                <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {uploadStatus.gelatoId}
>>>>>>> dededd1 (Please p)
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
<<<<<<< HEAD
          {uploadStatus.status === 'ready' && uploadStatus.shopifyId && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center mb-3">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h4 className="font-semibold text-green-800">Product Created Successfully!</h4>
              </div>
              
              {uploadStatus.message && (
                <p className="text-green-700 mb-4">{uploadStatus.message}</p>
              )}
              
              <div className="flex space-x-4">
                {uploadStatus.shopifyUrl && (
                  <a
                    href={uploadStatus.shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    View in Shopify Admin
                  </a>
                )}
                <a
                  href={`/products/${uploadStatus.productId}`}
                  className="btn btn-secondary"
                >
                  View Product Details
                </a>
              </div>
            </div>
          )}

          {/* Error Actions */}
          {uploadStatus.status === 'error' && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center mb-2">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <h4 className="font-semibold text-red-800">Upload Failed</h4>
              </div>
              {uploadStatus.message && (
                <p className="text-red-700">{uploadStatus.message}</p>
              )}
=======
          {uploadStatus.status === 'ready' && uploadStatus.gelatoId && (
            <div className="mt-6 flex space-x-4">
              <a
                href={`https://dashboard.gelato.com/products/${uploadStatus.gelatoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                View in Gelato Dashboard
              </a>
              <a
                href={`/products/${uploadStatus.productId}`}
                className="btn btn-secondary"
              >
                View Product Details
              </a>
>>>>>>> dededd1 (Please p)
            </div>
          )}
        </div>
      )}

      {/* Mode Information */}
      {uploadStatus.mode === 'DEMO' && (
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="text-lg font-semibold text-yellow-800 mb-3">
            🚀 Demo Mode Active
          </h3>
          <div className="text-sm text-yellow-700 space-y-2">
            <p>
<<<<<<< HEAD
              This demo creates <strong>2 art print variants</strong> (A4 and 50×70cm) in premium paper without frames.
            </p>
            <p>
              The full production version would create <strong>20+ variants</strong> across all size, material, and frame combinations.
            </p>
            <p>
              Products are created in <strong>local database only</strong> - no Shopify store integration in demo mode.
=======
              This demo creates <strong>2 poster variants</strong> (A4 and 50×70cm) in premium paper without frames.
            </p>
            <p>
              The full production version would create <strong>20-30 variants</strong> across all size, material, and frame combinations.
            </p>
            <p>
              Products are created in <strong>Gelato Sandbox</strong> environment - no real printing costs incurred.
>>>>>>> dededd1 (Please p)
            </p>
          </div>
        </div>
      )}

      {uploadStatus.mode === 'PRODUCTION' && (
        <div className="card bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-800 mb-3">
            🚀 Production Mode Active
          </h3>
          <div className="text-sm text-green-700 space-y-2">
            <p>
              Your products are being created with <strong>full variant coverage</strong> across all available sizes, materials, and frame options.
            </p>
            <p>
<<<<<<< HEAD
              Products are integrated with <strong>Shopify's Admin API</strong> for direct store management.
            </p>
            <p>
              All generated products will be available for immediate sale in your Shopify store.
=======
              Products are integrated with <strong>Gelato's production network</strong> for real-world fulfillment.
            </p>
            <p>
              All generated products will be available for immediate sale and printing.
>>>>>>> dededd1 (Please p)
            </p>
          </div>
        </div>
      )}
    </div>
  )
} 
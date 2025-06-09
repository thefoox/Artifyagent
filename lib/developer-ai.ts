interface DeveloperAIResponse {
  success: boolean
  response?: any[]
  model?: string
  usage?: any
  error?: string
  type?: string
  status?: number
}

interface DeveloperAIRequest {
  message: string
  context?: string
}

export class DeveloperAI {
  private baseUrl: string

  constructor(baseUrl: string = '/api/developer-ai') {
    this.baseUrl = baseUrl
  }

  /**
   * Send a message to the developer AI agent
   */
  async query(message: string, context?: string): Promise<DeveloperAIResponse> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context
        } as DeveloperAIRequest)
      })

      const data: DeveloperAIResponse = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || `HTTP ${response.status}`)
      }

      return data
    } catch (error) {
      console.error('Developer AI query failed:', error)
      throw error
    }
  }

  /**
   * Get information about the developer AI service
   */
  async getInfo() {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'GET'
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error('Failed to get developer AI info:', error)
      throw error
    }
  }

  /**
   * Analyze API integration issues
   */
  async analyzeIntegration(apis: string[], issue?: string) {
    const context = `APIs involved: ${apis.join(', ')}${issue ? `\nIssue description: ${issue}` : ''}`
    return this.query(
      "Analyze the current API integrations and identify potential issues, optimization opportunities, and suggest improvements.",
      context
    )
  }

  /**
   * Optimize system performance
   */
  async optimizeSystem(currentMetrics?: any) {
    const context = currentMetrics ? `Current metrics: ${JSON.stringify(currentMetrics)}` : undefined
    return this.query(
      "Review the system architecture and suggest optimizations for better performance, reliability, and maintainability.",
      context
    )
  }

  /**
   * Review user flow and suggest improvements
   */
  async reviewUserFlow(flowDescription: string) {
    return this.query(
      "Analyze the user flow and suggest improvements for better user experience and conversion.",
      `User flow: ${flowDescription}`
    )
  }

  /**
   * Debug API communication issues
   */
  async debugAPIIssue(apiName: string, errorDetails: string) {
    return this.query(
      `Debug API communication issue with ${apiName}. Analyze the error and provide solutions.`,
      `Error details: ${errorDetails}`
    )
  }
}

// Export a default instance
export const developerAI = new DeveloperAI()

// Export utility functions for common tasks
export const DeveloperAITasks = {
  /**
   * Quick system health check
   */
  healthCheck: () => developerAI.query(
    "Perform a comprehensive health check of all system integrations. Check API connectivity, data flow, and identify any issues."
  ),

  /**
   * Get optimization recommendations
   */
  getRecommendations: () => developerAI.query(
    "Provide specific recommendations for optimizing the current system architecture, API usage, and user experience."
  ),

  /**
   * Analyze documentation coverage
   */
  analyzeDocumentation: () => developerAI.query(
    "Review the available API documentation and identify gaps, inconsistencies, or areas that need better integration."
  )
} 
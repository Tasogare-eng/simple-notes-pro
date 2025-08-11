export async function redirectToCheckout() {
  try {
    const response = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to create checkout session')
    }

    const { url } = await response.json()
    
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Error redirecting to checkout:', error)
    throw error
  }
}

export async function redirectToPortal() {
  try {
    const response = await fetch('/api/stripe/portal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to create portal session')
    }

    const { url } = await response.json()
    
    if (url) {
      window.location.href = url
    }
  } catch (error) {
    console.error('Error redirecting to portal:', error)
    throw error
  }
}
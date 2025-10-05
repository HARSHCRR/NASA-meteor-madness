'use client'

import { useEffect, useCallback } from 'react'

// Throttle function for performance optimization
export function useThrottle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): T {
  let inThrottle: boolean
  
  return ((...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }) as T
}

// Hook for ripple effect on button clicks
export function useRippleEffect() {
  const createRipple = useCallback((event: React.MouseEvent<HTMLElement>) => {
    const button = event.currentTarget
    const rect = button.getBoundingClientRect()
    const size = Math.max(rect.width, rect.height)
    const x = event.clientX - rect.left - size / 2
    const y = event.clientY - rect.top - size / 2

    const ripple = document.createElement('span')
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s linear;
      pointer-events: none;
    `

    button.appendChild(ripple)

    setTimeout(() => {
      ripple.remove()
    }, 600)
  }, [])

  return createRipple
}

// Hook for intersection observer animations
export function useIntersectionObserver(
  threshold: number = 0.1,
  rootMargin: string = '0px 0px -50px 0px'
) {
  const observeElements = useCallback((elements: (HTMLElement | null)[]) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('fade-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    elements.forEach((el) => {
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return observeElements
}

// Hook for scroll-based animations
export function useScrollAnimation() {
  useEffect(() => {
    const handleScroll = () => {
      // Add any scroll-based animations here
    }

    const throttledScrollHandler = useThrottle(handleScroll, 16) // ~60fps
    window.addEventListener('scroll', throttledScrollHandler)

    return () => window.removeEventListener('scroll', throttledScrollHandler)
  }, [])
}

// Hook for lazy loading images
export function useLazyLoading() {
  useEffect(() => {
    const images = document.querySelectorAll('img[data-src]')
    
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement
            img.src = img.dataset.src || ''
            img.removeAttribute('data-src')
            imageObserver.unobserve(img)
          }
        })
      })
      
      images.forEach((img) => imageObserver.observe(img))
    } else {
      // Fallback for browsers without IntersectionObserver
      images.forEach((img) => {
        const imgElement = img as HTMLImageElement
        imgElement.src = imgElement.dataset.src || ''
        imgElement.removeAttribute('data-src')
      })
    }
  }, [])
}

import Link from 'next/link'

export default function CTA() {
  return (
    <section className="section bg-gradient-to-br from-asteroid-gray to-gray-800 text-center">
      <div className="container">
        <h2 className="text-4xl font-bold mb-4">Start Defending Earth</h2>
        <p className="text-xl mb-8 opacity-90">
          Join thousands of users exploring asteroid impact science through interactive simulation.
        </p>
        <Link href="/simulator/" className="btn-primary">
          Launch Simulator
        </Link>
      </div>
    </section>
  )
}

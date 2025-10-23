export default function Location() {
  return (
    <section className="py-15">
      <div className="max-w-[1100px] mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-4.5">
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">Where to Find Us</h3>
            <div className="text-muted">
              369 Limpsfield Road, Warlingham · Free parking nearby · 5★ hygiene
            </div>
            <div className="mt-3 bg-white border border-border rounded-2xl h-60 flex items-center justify-center text-muted">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2491.8449393!2d-0.0524!3d51.3089!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTHCsDE4JzMyLjAiTiAwwrAwMycwOC42Ilc!5e0!3m2!1sen!2suk!4v1234567890"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: '16px' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
          <div className="bg-white border border-border rounded-2xl p-4.5 shadow-sm">
            <h3 className="m-0 mb-1.5 font-bold text-lg">Questions?</h3>
            <div className="text-muted">
              Email{' '}
              <a href="mailto:hello@thescoopcompany.co.uk" className="text-pink-deep hover:underline">
                hello@thescoopcompany.co.uk
              </a>{' '}
              or DM us on Instagram{' '}
              <a
                href="https://instagram.com/thescoopcompany_"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-deep hover:underline"
              >
                @thescoopcompany_
              </a>
              .
            </div>
            <div className="inline-flex items-center gap-2 bg-white border border-border rounded-xl px-2.5 py-2 mt-3">
              It&apos;s not going to lick itself. 🍦
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

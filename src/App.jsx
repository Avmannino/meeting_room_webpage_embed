import "./App.css";
import ImageCarousel from "./components/ImageCarousel";

// ✅ Put your photos here:
import meeting1 from "./assets/images/meeting-1.jpg";
import meeting2 from "./assets/images/meeting-2.jpg";

const EMAIL = "info@wingsarena.com";

export default function App() {
  const images = [
    {
      src: meeting2,
      alt: "Meeting room conference setup with a long table and rolling chairs",
      label: "Conference Setup",
      note: "Long table + comfortable rolling chairs",
    },
    {
      src: meeting1,
      alt: "Meeting room with wall-mounted TV and ample seating",
      label: "Presentation Ready",
      note: "Wall-mounted TV for slides, video, and screen sharing",
    },
  ];

  const mailtoPricing = `mailto:${EMAIL}?subject=${encodeURIComponent(
    "Meeting Room Rental - Pricing & Availability"
  )}`;

  return (
    <div className="page">
      <div className="wrap">
        <div className="hero">
          <div className="heroGrid">
            <div className="heroContent">
              <div className="kicker">Private rental space • Rink-side option</div>
              <h1 className="h1">Meeting Room Rentals</h1>
              <p className="sub">
                Host a business meeting, team session, clinic, or presentation in a clean, private room with a
                full business center setup — conference tables, rolling office chairs, a wall-mounted TV, and
                dependable Wi-Fi for seamless work and presentations.
              </p>

              <div className="ctas">
                <a
                  className="btn btnPrimary"
                  href={mailtoPricing}
                  target="_top"
                  rel="noopener noreferrer"
                >
                  Email for Pricing & Availability
                </a>
              </div>

              <div className="smallNote">
                Availability and rates vary by date/time. Email{" "}
                <span className="email">{EMAIL}</span> for info, pricing & availability.
              </div>
            </div>

            <div>
              <ImageCarousel images={images} autoPlay autoPlayMs={3000} />
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="sectionTitle">What’s in the room</h2>
          <div className="grid2">
            <div className="card">
              <div className="cardTitle">Presentation-Ready</div>
              <p className="cardText">
                A large wall-mounted TV makes it easy to run presentations, videos, and meeting content.
              </p>
            </div>

            <div className="card">
              <div className="cardTitle">Conference Setup</div>
              <p className="cardText">
                Long wood conference table with comfortable rolling office chairs.
              </p>
            </div>

            <div className="card">
              <div className="cardTitle">Strategy Board</div>
              <p className="cardText">
                Dry-erase coaching board on the wall — perfect for business planning, team building, clinics,
                and meetings.
              </p>
            </div>

            <div className="card">
              <div className="cardTitle">Bright + Comfortable</div>
              <p className="cardText">
                Bright overhead panel lighting, carpeted flooring, and a clean, private room feel.
              </p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2 className="sectionTitle">Great for</h2>
          <ul className="list">
            <li>Business meetings, offsites, and team working sessions</li>
            <li>Coach / player meetings, video review, and chalk-talk</li>
            <li>Clinics, sponsor presentations, and community gatherings</li>
          </ul>
        </div>

        <div className="section">
          <div className="footerCTA">
            <p className="footerText">
              Ready to book or want to check dates? Email{" "}
              <span className="email">{EMAIL}</span> for pricing & availability.
            </p>
            <a
              className="btn btnPrimary"
              href={mailtoPricing}
              target="_top"
              rel="noopener noreferrer"
            >
              Email {EMAIL}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

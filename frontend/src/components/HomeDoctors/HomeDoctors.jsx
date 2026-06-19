// src/pages/Home/HomeDoctors.jsx
import React, { useEffect, useState } from "react";
import { Medal, ChevronsRight, MousePointer2Off } from "lucide-react";
import { Link } from "react-router-dom";
import { homeDoctorsStyles, iconSize } from "../../assets/dummyStyles";

const HomeDoctors = ({ apiBase, previewCount = 8 }) => {
  const API_BASE = apiBase || "http://localhost:4000";
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // load doctors from backend
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE}/api/doctors`);
        const json = await res.json().catch(() => null);

        if (!res.ok) {
          const msg =
            (json && json.message) || `Failed to load doctors (${res.status})`;
          if (!mounted) return;
          setError(msg);
          setDoctors([]);
          setLoading(false);
          return;
        }

        // support both { success: true, data: [...] } and plain array
        const items = (json && (json.data || json)) || [];
        // normalize each doctor for the UI
        const normalized = (Array.isArray(items) ? items : []).map((d) => {
          const id = d._id || d.id;
          const image =
            d.imageUrl || d.image || d.imageSmall || d.imageSrc || "";
          // availability might be stored as string "Available"/"Unavailable" OR boolean
          const available =
            (typeof d.availability === "string"
              ? d.availability.toLowerCase() === "available"
              : typeof d.available === "boolean"
                ? d.available
                : d.availability === true) || d.availability === "Available";
          return {
            id,
            name: d.name || "Unknown",
            specialization: d.specialization || "",
            image,
            experience:
              d.experience || d.experience === 0 ? String(d.experience) : "",
            fee: d.fee ?? d.price ?? 0,
            available,
            raw: d,
          };
        });

        if (!mounted) return;
        setDoctors(normalized);
      } catch (err) {
        if (!mounted) return;
        console.error("load doctors error:", err);
        setError("Network error while loading doctors.");
        setDoctors([]);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [API_BASE]);

  const preview = doctors.slice(0, previewCount);

  return (
    <section className={homeDoctorsStyles.section}>
      <div className={homeDoctorsStyles.container}>
        <div className={homeDoctorsStyles.header}>
          <h1 className={homeDoctorsStyles.title}>
            Our{" "}
            <span className={homeDoctorsStyles.titleSpan}>Medical Team</span>
          </h1>
          <p className={homeDoctorsStyles.subtitle}>
            Book appointments quickly with our verified specialists.
          </p>
        </div>

        {/* error / retry */}
        {error ? (
          <div className={homeDoctorsStyles.errorContainer}>
            <div className={homeDoctorsStyles.errorText}>{error}</div>
            <button
              onClick={() => {
                setLoading(true);
                setError("");
                // trigger useEffect reload by toggling API_BASE (simple re-run)
                // A more robust approach would expose a reload function; for now we call fetch again:
                (async () => {
                  try {
                    const res = await fetch(`${API_BASE}/api/doctors`);
                    const json = await res.json().catch(() => null);
                    const items = (json && (json.data || json)) || [];
                    const normalized = (Array.isArray(items) ? items : []).map(
                      (d) => {
                        const id = d._id || d.id;
                        const image = d.imageUrl || d.image || "";
                        const available =
                          (typeof d.availability === "string"
                            ? d.availability.toLowerCase() === "available"
                            : typeof d.available === "boolean"
                              ? d.available
                              : d.availability === true) ||
                          d.availability === "Available";
                        return {
                          id,
                          name: d.name || "Unknown",
                          specialization: d.specialization || "",
                          image,
                          experience: d.experience || "",
                          fee: d.fee ?? d.price ?? 0,
                          available,
                          raw: d,
                        };
                      },
                    );
                    setDoctors(normalized);
                    setError("");
                  } catch (err) {
                    console.error(err);
                    setError("Network error while loading doctors.");
                    setDoctors([]);
                  } finally {
                    setLoading(false);
                  }
                })();
              }}
              className={homeDoctorsStyles.retryButton}
            >
              Retry
            </button>
          </div>
        ) : null}

        {/* Loading skeleton */}
        {loading ? (
          <div className={homeDoctorsStyles.skeletonGrid}>
            {Array.from({ length: previewCount }).map((_, i) => (
              <div key={i} className={homeDoctorsStyles.skeletonCard}>
                <div className={homeDoctorsStyles.skeletonImage} />
                <div className={homeDoctorsStyles.skeletonText1} />
                <div className={homeDoctorsStyles.skeletonText2} />
                <div className="flex gap-2 mt-auto">
                  <div className={homeDoctorsStyles.skeletonButton} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Doctors grid
          <div className={homeDoctorsStyles.doctorsGrid}>
            {preview.map((doctor) => (
              <article
                key={doctor.id || doctor.name}
                className={homeDoctorsStyles.article}
                aria-labelledby={`doctor-${doctor.id}-name`}
              >
                {/* IMAGE — CLICKABLE ONLY IF AVAILABLE */}
                {doctor.available ? (
                  <Link
                    to={`/doctors/${doctor.id}`}
                    state={{ doctor: doctor.raw || doctor }}
                  >
                    <div className={homeDoctorsStyles.imageContainerAvailable}>
                      <img
                        src={doctor.image || "/placeholder-doctor.jpg"}
                        alt={doctor.name}
                        loading="lazy"
                        className={homeDoctorsStyles.image}
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "/placeholder-doctor.jpg";
                        }}
                      />
                    </div>
                  </Link>
                ) : (
                  <div className={homeDoctorsStyles.imageContainerUnavailable}>
                    <img
                      src={doctor.image || "/placeholder-doctor.jpg"}
                      alt={doctor.name}
                      loading="lazy"
                      className={homeDoctorsStyles.image}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = "/placeholder-doctor.jpg";
                      }}
                    />
                    {/* optional small badge */}
                    <div className={homeDoctorsStyles.unavailableBadge}>
                      Not available
                    </div>
                  </div>
                )}

                {/* BODY */}
                <div className={homeDoctorsStyles.cardBody}>
                  <h3
                    id={`doctor-${doctor.id}-name`}
                    className={homeDoctorsStyles.doctorName}
                  >
                    {doctor.name}
                  </h3>

                  <p className={homeDoctorsStyles.specialization}>
                    {doctor.specialization}
                  </p>

                  <div className={homeDoctorsStyles.experienceContainer}>
                    <div className={homeDoctorsStyles.experienceBadge}>
                      <Medal className={`${iconSize.small} h-4`} />
                      <span>{doctor.experience} years Experience</span>
                    </div>
                  </div>

                  <div className={homeDoctorsStyles.buttonContainer}>
                    {/* BUTTON — keep full width (desktop unchanged) */}
                    <div className="w-full">
                      {doctor.available ? (
                        <Link
                          to={`/doctors/${doctor.id}`}
                          state={{ doctor: doctor.raw || doctor }}
                          className={homeDoctorsStyles.buttonAvailable}
                          aria-label={`Book appointment with ${doctor.name}`}
                        >
                          <ChevronsRight className="w-5 h-5" />
                          Book Now
                        </Link>
                      ) : (
                        <button
                          disabled
                          className={homeDoctorsStyles.buttonUnavailable}
                          aria-label={`${doctor.name} not available`}
                        >
                          <MousePointer2Off className="w-5 h-5" />
                          Not Available
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <style>{homeDoctorsStyles.customCSS}</style>
    </section>
  );
};

export default HomeDoctors;

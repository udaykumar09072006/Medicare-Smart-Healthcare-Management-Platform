// AddService.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { addServiceStyles } from "../../assets/dummyStyles";



export default function AddService({ apiBase, serviceId }) {
  const API_BASE = apiBase || "http://localhost:4000";
  const navigate = useNavigate();

  const fileRef = useRef(null);
  const [imagePreview, setImagePreview] = useState(null); // either objectURL or remote imageUrl
  const [imageFile, setImageFile] = useState(null); // File when user chooses a new one
  const [hasExistingImage, setHasExistingImage] = useState(false); // true if fetched service had an imageUrl
  const [removeImage, setRemoveImage] = useState(false); // user wants to remove existing image

  const [serviceName, setServiceName] = useState("");
  const [about, setAbout] = useState("");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState("available");

  const [instructions, setInstructions] = useState([""]);
  const [slots, setSlots] = useState([]);

  // Date/time controls for adding a slot
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()); // local midnight today
  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth(); // 0-11
  const currentDate = today.getDate();

  const years = Array.from({ length: 5 }).map((_, i) => currentYear + i);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours = Array.from({ length: 12 }).map((_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 12 }).map((_, i) =>
    String(i * 5).padStart(2, "0")
  );
  const ampm = ["AM", "PM"];

  // initial values as strings matching options
  const [slotDay, setSlotDay] = useState(String(currentDate));
  const [slotMonth, setSlotMonth] = useState(String(currentMonth)); // store month index
  const [slotYear, setSlotYear] = useState(String(currentYear));
  const [slotHour, setSlotHour] = useState("11");
  const [slotMinute, setSlotMinute] = useState("00");
  const [slotAmPm, setSlotAmPm] = useState("AM");

  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  // compute days for selected month/year (respecting month length)
  const selectedYearNum = Number(slotYear);
  const selectedMonthNum = Number(slotMonth);
  const daysInSelectedMonth = new Date(
    selectedYearNum,
    selectedMonthNum + 1,
    0
  ).getDate();
  const days = Array.from({ length: daysInSelectedMonth }).map((_, i) =>
    String(i + 1)
  );

  // clamp selected day if month/year changes to a smaller month
  useEffect(() => {
    if (Number(slotDay) > daysInSelectedMonth) {
      setSlotDay(String(daysInSelectedMonth));
    }
    // if user selected a year/month that is earlier than today (shouldn't happen since we disable),
    // ensure the day is at least today's date for the same month/year
    // (we mostly rely on disabling month/day options below)
  }, [slotMonth, slotYear, daysInSelectedMonth]); // eslint-disable-line

  // ----- Fetch service when editing -----
  useEffect(() => {
    let mounted = true;
    async function loadService() {
      if (!serviceId) return;
      try {
        const res = await fetch(`${API_BASE}/api/services/${serviceId}`);
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          console.warn("Failed to fetch service:", res.status, txt);
          showToast(
            "error",
            "Load failed",
            "Could not load service for editing."
          );
          return;
        }
        const payload = await res.json().catch(() => null);
        const data = payload?.data || payload;
        if (!data) return;
        if (!mounted) return;

        setServiceName(data.name || "");
        setAbout(data.about || data.description || "");
        setPrice(data.price != null ? String(data.price) : "");
        setAvailability(data.available ? "available" : "unavailable");
        setInstructions(
          Array.isArray(data.instructions) && data.instructions.length
            ? data.instructions
            : [""]
        );
        setSlots(convertServiceSlotsToFormattedArray(data.slots));
        // image: show remote image URL as preview
        if (data.imageUrl) {
          setImagePreview(data.imageUrl);
          setHasExistingImage(true);
          setRemoveImage(false);
        } else {
          setImagePreview(null);
          setHasExistingImage(false);
        }
      } catch (err) {
        console.error("loadService error:", err);
        showToast("error", "Network error", "Could not load service.");
      }
    }
    loadService();
    return () => {
      mounted = false;
    };
  }, [serviceId, API_BASE]);

  // ----- Image change -----
  function handleImageChange(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    // if previous preview is an object URL revoke it
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {}
    }
    setImageFile(f);
    setImagePreview(URL.createObjectURL(f));
    // if user chooses a new file, we should no longer be removing the existing image
    setRemoveImage(false);
    setHasExistingImage(false);
  }

  // ----- Instructions helpers -----
  function addInstruction() {
    setInstructions((s) => [...s, ""]);
  }
  function updateInstruction(i, v) {
    setInstructions((s) => s.map((x, idx) => (idx === i ? v : x)));
  }
  function removeInstruction(i) {
    setInstructions((s) => s.filter((_, idx) => idx !== i));
  }

  // ----- Reset form -----
  function resetForm() {
    if (imagePreview && imagePreview.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(imagePreview);
      } catch (err) {}
    }
    setImagePreview(null);
    setImageFile(null);
    setHasExistingImage(false);
    setRemoveImage(false);
    setServiceName("");
    setAbout("");
    setPrice("");
    setAvailability("available");
    setInstructions([""]);
    setSlots([]);
    setErrors({});
  }

  function showToast(type, title, message) {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3500);
  }

  function convertServiceSlotsToFormattedArray(rawSlots) {
    if (!rawSlots) return [];
    if (Array.isArray(rawSlots)) return rawSlots;

    if (typeof rawSlots === "object") {
      return Object.entries(rawSlots).flatMap(([dateKey, times]) => {
        if (!Array.isArray(times)) return [];
        const [year, month, day] = String(dateKey).split("-");
        const parsedDate = new Date(dateKey);
        const mLabel = months[Number(month) - 1] || "Jan";
        const dd = String(Number(day)).padStart(2, "0");
        return times.map((time) => `${dd} ${mLabel} ${year} • ${time}`);
      });
    }

    return [];
  }

  // helper: convert selected 12h components to a Date object (local)
  function selectedDateTime() {
    const d = Number(slotDay);
    const m = Number(slotMonth);
    const y = Number(slotYear);
    let h = Number(slotHour);
    const mm = Number(slotMinute);
    const ap = slotAmPm;

    // convert 12h to 24h
    if (ap === "AM") {
      if (h === 12) h = 0;
    } else {
      if (h !== 12) h = h + 12;
    }

    return new Date(y, m, d, h, mm, 0, 0);
  }

  function isSelectedDateTimeInPast() {
    const sel = selectedDateTime();
    return sel.getTime() <= Date.now();
  }

  // ----- Slots -----
  function addSlot() {
    // build formatted string as before
    const m = months[Number(slotMonth)];
    const d = String(slotDay).padStart(2, "0");
    const y = slotYear;
    const h = String(slotHour).padStart(2, "0");
    const mm = slotMinute;
    const ap = slotAmPm;
    const formatted = `${d} ${m} ${y} • ${h}:${mm} ${ap}`;

    // prevent duplicates
    if (slots.includes(formatted)) {
      showToast(
        "error",
        "Duplicate Slot",
        "This time slot has already been added. Please select a different time."
      );
      return;
    }

    // block past date/time
    if (isSelectedDateTimeInPast()) {
      showToast(
        "error",
        "Past Time",
        "You cannot add a time slot in the past. Please select a future date/time."
      );
      setErrors((e) => ({ ...e, slots: true }));
      return;
    }

    setSlots((s) => [...s, formatted]);
    setErrors((e) => ({ ...e, slots: false }));
    showToast("success", "Slot Added", `Time slot added: ${formatted}`);
  }

  function removeSlot(i) {
    const removedSlot = slots[i];
    setSlots((s) => s.filter((_, idx) => idx !== i));
    showToast("info", "Slot Removed", `Removed: ${removedSlot}`);
  }

  // ----- Validation -----
  function validate() {
    const newErrors = {};
    // When creating: require imageFile or existing image.
    // When editing, allow explicit image removal.
    if (!imageFile && !hasExistingImage && !removeImage) newErrors.image = true;
    if (!serviceName.trim()) newErrors.serviceName = true;
    if (!about.trim()) newErrors.about = true;
    if (!String(price).trim()) newErrors.price = true;
    if (!instructions.some((ins) => ins.trim())) newErrors.instructions = true;
    if (!slots.length) newErrors.slots = true;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // ----- Submit (create or update) -----
  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) {
      showToast(
        "error",
        "Missing Fields",
        "Please fill all required fields before submitting."
      );
      return;
    }

    setSubmitting(true);

    try {
      const fd = new FormData();
      fd.append("name", serviceName);
      fd.append("about", about);
      const numericPrice = String(price).replace(/[^\d.-]/g, "");
      fd.append("price", numericPrice === "" ? "0" : numericPrice);
      fd.append("availability", availability);
      // arrays serialized as JSON
      fd.append("instructions", JSON.stringify(instructions));
      fd.append("slots", JSON.stringify(slots));

      // Image handling:
      // - If user selected a new file -> append under "image"
      // - If user checked removeImage -> add removeImage flag
      if (imageFile) {
        fd.append("image", imageFile);
      } else if (removeImage) {
        fd.append("removeImage", "true");
      }

      const url = serviceId
        ? `${API_BASE}/api/services/${serviceId}`
        : `${API_BASE}/api/services`;
      const method = serviceId ? "PUT" : "POST";

      const res = await fetch(url, { method, body: fd });
      const data = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = data?.message || `Server error (${res?.status || "?"})`;
        showToast("error", "Save Failed", msg);
        setSubmitting(false);
        return;
      }

      showToast(
        "success",
        serviceId ? "Service Updated" : "Service Added",
        `${serviceName} saved with ${slots.length} slot(s).`
      );

      navigate("/list-service");

      // If created new, reset form. If edited, update preview states to reflect server response
      if (!serviceId) {
        resetForm();
        if (fileRef.current) fileRef.current.value = null;
      } else {
        // update local state to reflect server returned object (if available)
        const saved = data?.data || null;
        if (saved) {
          setHasExistingImage(Boolean(saved.imageUrl));
          setImagePreview(saved.imageUrl || null);
          setImageFile(null);
          setRemoveImage(false);
        }
      }
    } catch (err) {
      console.error("service submit error:", err);
      showToast("error", "Network error", "Could not reach server.");
    } finally {
      setSubmitting(false);
    }
  }

  // ----- UI -----
  return (
    <div className={addServiceStyles.container.main}>
      {/* Toast Notification */}
      <div className={addServiceStyles.toast.container}>
        {toast && (
          <div
            className={`${addServiceStyles.toast.toastBase} ${
              toast.type === "error"
                ? addServiceStyles.toast.toastError
                : toast.type === "info"
                ? addServiceStyles.toast.toastInfo
                : addServiceStyles.toast.toastSuccess
            } animate-slideIn`}
          >
            <div className={addServiceStyles.toast.iconContainer(toast.type)}>
              {toast.type === "error" ? (
                <AlertTriangle className="w-5 h-5" />
              ) : toast.type === "info" ? (
                <Clock className="w-5 h-5" />
              ) : (
                <CheckCircle className="w-5 h-5" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className={addServiceStyles.toast.title}>
                {toast.title}
              </div>
              <div className={addServiceStyles.toast.message}>
                {toast.message}
              </div>
            </div>
            <button
              onClick={() => setToast(null)}
              className={addServiceStyles.buttons.toastClose}
            >
              <XCircle className="w-4 h-4 text-gray-400 hover:text-gray-600" />
            </button>
          </div>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className={addServiceStyles.container.form}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className={addServiceStyles.header.title}>
              {serviceId ? "Edit Service" : "Add Service"}
            </h1>
            <p className={addServiceStyles.header.subtitle}>
              Create a beautiful service card with unique time slots
            </p>
          </div>
          <div className={addServiceStyles.headerActions}>
            <button
              type="button"
              onClick={resetForm}
              className={addServiceStyles.buttons.reset}
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={addServiceStyles.buttons.submit}
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  {serviceId ? "Update Service" : "Save Service"}
                </>
              )}
            </button>
          </div>
        </div>

        <div className={addServiceStyles.grids.main}>
          {/* left column - image */}
          <div className="lg:col-span-1 md:col-span-1 col-span-1 flex flex-col items-center">
            <div
              className={addServiceStyles.imageUpload.container(errors.image)}
            >
              <div className={addServiceStyles.imageUpload.preview}>
                {imagePreview ? (
                  // if preview is remote url or object URL
                  <img
                    src={imagePreview}
                    alt="preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={addServiceStyles.imageUpload.placeholder}>
                    <ImageIcon className="w-10 h-10" />
                    <div className="mt-2 text-sm">Service image (required)</div>
                  </div>
                )}
              </div>

              <div className="w-full flex gap-2 items-center">
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={addServiceStyles.buttons.uploadImage}
                >
                  <Plus className="w-4 h-4" />{" "}
                  {imagePreview ? "Replace Image" : "Upload Image"}
                </button>

                {(imagePreview || hasExistingImage) && (
                  <button
                    type="button"
                    onClick={() => {
                      // If current preview is a blob URL, revoke it
                      if (imagePreview && imagePreview.startsWith("blob:")) {
                        try {
                          URL.revokeObjectURL(imagePreview);
                        } catch (err) {}
                      }
                      setImagePreview(null);
                      setImageFile(null);
                      // mark that user wants to remove the existing image
                      if (hasExistingImage) {
                        setRemoveImage(true);
                        setHasExistingImage(false);
                      }
                      if (fileRef.current) fileRef.current.value = null;
                    }}
                    className={addServiceStyles.buttons.removeImage}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                )}
              </div>

              {/* option to remove existing image explicitly when editing */}
              {hasExistingImage && (
                <div className="w-full text-xs text-gray-600 mt-2 flex items-center gap-2">
                  <input
                    id="remove-img"
                    type="checkbox"
                    checked={removeImage}
                    onChange={(e) => {
                      setRemoveImage(Boolean(e.target.checked));
                      if (e.target.checked) {
                        setImagePreview(null);
                        setImageFile(null);
                        setHasExistingImage(false);
                      }
                    }}
                    className="rounded"
                  />
                  <label htmlFor="remove-img">Remove existing image</label>
                </div>
              )}
            </div>
          </div>

          {/* right column - main fields */}
          <div className="lg:col-span-2 md:col-span-1 col-span-1 space-y-6">
            <div className={addServiceStyles.grids.formFields}>
              <div>
                <label className={addServiceStyles.labels.standard}>
                  Service name
                </label>
                <input
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  placeholder="e.g. General Consultation"
                  className={addServiceStyles.formFields.input(errors.serviceName)}
                />
              </div>

              <div>
                <label className={addServiceStyles.labels.standard}>
                  Price
                </label>
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="₹ 499"
                  className={addServiceStyles.formFields.input(errors.price)}
                  inputMode="numeric"
                />

                <div className="mt-3">
                  <label className={addServiceStyles.labels.standard}>
                    Availability
                  </label>
                  <select
                    value={availability}
                    onChange={(e) => setAvailability(e.target.value)}
                    className={addServiceStyles.formFields.select}
                  >
                    <option value="available">Available</option>
                    <option value="unavailable">Unavailable</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className={addServiceStyles.labels.standard}>
                About this service
              </label>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Short description"
                rows={4}
                className={addServiceStyles.formFields.textarea(errors.about)}
              />
            </div>

            {/* instructions */}
            <div>
              <div className="flex items-center justify-between">
                <label className={addServiceStyles.labels.standard}>
                  Instructions (point wise)
                </label>
                <button
                  type="button"
                  onClick={addInstruction}
                  className={addServiceStyles.buttons.addInstruction}
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div
                className={addServiceStyles.instructions.container(errors.instructions)}
              >
                {instructions.map((ins, idx) => (
                  <div
                    key={idx}
                    className={addServiceStyles.instructions.item}
                  >
                    <div className={addServiceStyles.icon.number}>
                      {idx + 1}.
                    </div>
                    <input
                      value={ins}
                      onChange={(e) => updateInstruction(idx, e.target.value)}
                      placeholder={`Instruction ${idx + 1}`}
                      className={addServiceStyles.instructions.input}
                    />
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(idx)}
                        className={addServiceStyles.instructions.removeButton}
                      >
                        <Trash2 className={addServiceStyles.icon.removeInstruction} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* slot controls */}
            <div
              className={addServiceStyles.slots.container(errors.slots)}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-emerald-700 font-medium">
                  <Calendar className="w-5 h-5" /> Slots & Schedule
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm text-gray-500">
                    {slots.length} slot{slots.length !== 1 ? "s" : ""} added
                  </div>
                </div>
              </div>

              <div className={addServiceStyles.grids.timeGrid}>
                <div className="min-w-0">
                  <label className={addServiceStyles.labels.small}>Day</label>
                  <select
                    value={slotDay}
                    onChange={(e) => setSlotDay(e.target.value)}
                    className={addServiceStyles.formFields.smallSelect}
                  >
                    {days.map((d) => {
                      const dNum = Number(d);
                      const disabled =
                        Number(slotYear) === currentYear &&
                        Number(slotMonth) === currentMonth &&
                        dNum < currentDate;
                      return (
                        <option key={d} value={d} disabled={disabled}>
                          {d}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={addServiceStyles.labels.small}>Month</label>
                  <select
                    value={slotMonth}
                    onChange={(e) => setSlotMonth(e.target.value)}
                    className={addServiceStyles.formFields.smallSelect}
                  >
                    {months.map((m, idx) => {
                      const disabled =
                        Number(slotYear) === currentYear && idx < currentMonth;
                      return (
                        <option key={m} value={String(idx)} disabled={disabled}>
                          {m}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className={addServiceStyles.labels.small}>Year</label>
                  <select
                    value={slotYear}
                    onChange={(e) => setSlotYear(e.target.value)}
                    className={addServiceStyles.formFields.smallSelect}
                  >
                    {years.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={addServiceStyles.grids.timeSubGrid}>
                  <div className="min-w-0">
                    <label className={addServiceStyles.labels.small}>Hour</label>
                    <select
                      value={slotHour}
                      onChange={(e) => setSlotHour(e.target.value)}
                      className={addServiceStyles.formFields.timeSelect}
                    >
                      {hours.map((h) => (
                        <option key={h} value={h}>
                          {h}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className={addServiceStyles.labels.small}>Minute</label>
                    <select
                      value={slotMinute}
                      onChange={(e) => setSlotMinute(e.target.value)}
                      className={addServiceStyles.formFields.timeSelect}
                    >
                      {minutes.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="min-w-0">
                    <label className={addServiceStyles.labels.small}>AM/PM</label>
                    <select
                      value={slotAmPm}
                      onChange={(e) => setSlotAmPm(e.target.value)}
                      className={addServiceStyles.formFields.ampmSelect}
                    >
                      {ampm.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={addSlot}
                  className={addServiceStyles.buttons.addSlot}
                >
                  <Plus className="w-4 h-4" /> Add This Time Slot
                </button>
              </div>

              <div>
                <div className="text-xs text-gray-500 mb-2">
                  Added Slots ({slots.length})
                </div>

                <div className={addServiceStyles.grids.slotsGrid}>
                  {slots.length === 0 ? (
                    <div className="text-sm text-gray-400 italic px-4 py-2">
                      No slots added yet. Select a time and click "Add This Time Slot"
                    </div>
                  ) : (
                    slots.map((s, idx) => (
                      <div
                        key={s}
                        className={addServiceStyles.slots.slotItem}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <Clock className={addServiceStyles.icon.clock} />
                          <div className={addServiceStyles.slots.slotText}>
                            {s}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeSlot(idx)}
                          className={addServiceStyles.buttons.slotRemove}
                        >
                          <Trash2 className={addServiceStyles.icon.trash} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>

      <style>{addServiceStyles.customCSS}</style>
    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { Star, Camera, X, Send, AlertCircle, CheckCircle2, Check, Sparkles, Heart } from 'lucide-react';
import { CuteMonkey } from './CuteMonkey';
import { Confetti } from './Confetti';

const RATING_LABELS = {
  5: 'ประทับใจมากที่สุด รักเลย ❤️✨',
  4: 'สินค้าตรงปก บริการดีมาก 👍🌸',
  3: 'พึงพอใจ ได้รับของครบถ้วน 😊',
  2: 'พอใช้ อยากให้ปรับปรุงนิดนึง 🙂',
  1: 'ต้องการให้ทางร้านปรับปรุงบริการ 💬',
};

const QUICK_TAGS = [
  { label: '📦 แพ็คของน่ารักมาก', text: 'แพ็คของมาน่ารักมากเลยค่ะ มีความใส่ใจสุดๆ ' },
  { label: '⚡ ส่งไวทันใจ', text: 'จัดส่งสินค้ารวดเร็วทันใจมากค่ะ ' },
  { label: '🌸 แม่ค้าตอบไวน่ารัก', text: 'แม่ค้าใจดีตอบแชทไวและน่ารักมากค่ะ ' },
  { label: '✨ สินค้าตรงปก 100%', text: 'สินค้าตรงปกของจริงน่ารักมากกก ' },
  { label: '💖 มีของแถมน่ารัก', text: 'มีของแถมน่ารักๆ ใส่มาให้ด้วย ประทับใจมากค่ะ ' },
  { label: '🥰 จะกลับมาซื้ออีก', text: 'ประทับใจสุดๆ ไว้จะกลับมาอุดหนุนอีกแน่นอนค่ะ ' },
];

export function ReviewForm({ onReviewSubmitted }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [images, setImages] = useState([]); // Array of { file, previewUrl, id }
  const [honeypot, setHoneypot] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);

  // Auto-dismiss floating toast notifications after 3.5s
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => {
      setSuccessMessage('');
    }, 3500);
    return () => clearTimeout(timer);
  }, [successMessage]);

  useEffect(() => {
    if (!errorMessage) return;
    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3500);
    return () => clearTimeout(timer);
  }, [errorMessage]);

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (!selectedFiles.length) return;

    setErrorMessage('');

    if (images.length + selectedFiles.length > 3) {
      setErrorMessage('สามารถแนบรูปภาพได้สูงสุด 3 รูปเท่านั้นค่ะ');
      return;
    }

    const maxFileSize = 3 * 1024 * 1024; // 3MB
    const validExtensions = ['image/jpeg', 'image/png', 'image/webp'];
    const newItems = [];

    for (const file of selectedFiles) {
      if (!validExtensions.includes(file.type.toLowerCase())) {
        setErrorMessage(`ไฟล์ "${file.name}" ไม่ใช่รูปภาพ JPG, PNG หรือ WebP ค่ะ`);
        return;
      }
      if (file.size > maxFileSize) {
        setErrorMessage(`รูปภาพ "${file.name}" มีขนาดเกิน 3MB กรุณาเลือกรูปขนาดเล็กลงค่ะ`);
        return;
      }

      newItems.push({
        file,
        previewUrl: URL.createObjectURL(file),
        id: Math.random().toString(36).slice(2),
      });
    }

    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemoveImage = (idToRemove) => {
    setImages((prev) => {
      const filtered = prev.filter((img) => img.id !== idToRemove);
      const target = prev.find((img) => img.id === idToRemove);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return filtered;
    });
  };

  const handleAddQuickTag = (tagText) => {
    setComment((prev) => {
      if (prev.includes(tagText.trim())) return prev;
      const combined = prev ? `${prev} ${tagText}` : tagText;
      return combined.slice(0, 500);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!name.trim()) {
      setErrorMessage('กรุณากรอกชื่อของคุณค่ะ');
      return;
    }
    if (name.length > 40) {
      setErrorMessage('ชื่อต้องมีความยาวไม่เกิน 40 ตัวอักษรค่ะ');
      return;
    }
    if (!rating || rating < 1 || rating > 5) {
      setErrorMessage('กรุณาเลือกคะแนนดาว 1-5 ดาวค่ะ');
      return;
    }
    if (!comment.trim()) {
      setErrorMessage('กรุณากรอกข้อความรีวิว/ความประทับใจค่ะ');
      return;
    }
    if (comment.length > 500) {
      setErrorMessage('ข้อความรีวิวต้องไม่เกิน 500 ตัวอักษรค่ะ');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('rating', rating.toString());
      formData.append('comment', comment.trim());
      formData.append('website', honeypot);

      images.forEach((img) => {
        formData.append('images', img.file);
      });

      const res = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'ไม่สามารถส่งรีวิวได้ กรุณาลองใหม่อีกครั้ง');
      }

      // Success
      setSuccessMessage(data.message || 'ขอบคุณสำหรับรีวิวและเครดิตร้าน Pattancute ค่ะ!');
      setShowConfetti(true);

      images.forEach((img) => URL.revokeObjectURL(img.previewUrl));

      setName('');
      setRating(5);
      setComment('');
      setImages([]);
      setHoneypot('');

      if (onReviewSubmitted) {
        onReviewSubmitted(data.review);
      }
    } catch (err) {
      setErrorMessage(err.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="review-form" className="w-full max-w-2xl mx-auto px-4 mb-16 scroll-mt-6 font-sans">
      {/* Confetti Trigger */}
      {showConfetti && <Confetti onComplete={() => setShowConfetti(false)} />}

      <div className="card-bento p-6 sm:p-9 relative overflow-hidden">
        {/* Cute Mascot sticker floating in top-right, reacts dynamically to rating */}
        <div className="absolute -top-3 -right-3 z-10 hidden sm:block anim-float">
          <div className="p-1 rounded-full bg-white shadow-sticker transition-transform">
            <CuteMonkey
              className="w-13 h-13 max-w-full max-h-full"
              mood={
                (hoverRating || rating) === 5
                  ? 'love'
                  : (hoverRating || rating) === 4
                  ? 'cheer'
                  : (hoverRating || rating) === 3
                  ? 'happy'
                  : 'wink'
              }
            />
          </div>
        </div>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-pattan-blue/10">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-pattan-blue/20 to-pattan-pink/20 flex items-center justify-center text-pattan-blue shadow-xs">
            <Sparkles className="w-5 h-5 text-pattan-yellow fill-pattan-yellow" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-pattan-blue dark:text-pattan-blue-light font-display flex items-center gap-1.5">
              <span>ให้เครดิต &amp; เขียนรีวิว</span>
              <Heart className="w-4 h-4 text-pattan-pink fill-pattan-pink" />
            </h2>
            <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
              ส่งต่อความน่ารักและความประทับใจของคุณได้ที่นี่น้า~
            </p>
          </div>
        </div>

        {/* Floating Minimal Toast Notifications */}
        {successMessage && (
          <div className="fixed top-6 left-1/2 z-50 animate-toast max-w-sm w-[92%] sm:w-auto pointer-events-auto">
            <div className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-between gap-3 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-emerald-200 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <span className="truncate">{successMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setSuccessMessage('')}
                className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer shrink-0"
                aria-label="ปิดการแจ้งเตือน"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {errorMessage && (
          <div className="fixed top-6 left-1/2 z-50 animate-toast max-w-sm w-[92%] sm:w-auto pointer-events-auto">
            <div className="px-4 py-2.5 rounded-full text-xs font-bold flex items-center justify-between gap-3 shadow-xl bg-white/95 dark:bg-slate-800/95 backdrop-blur-md border border-rose-200 dark:border-rose-700/60 text-rose-800 dark:text-rose-300">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-5 h-5 rounded-full bg-rose-100 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-3 h-3" />
                </div>
                <span className="truncate">{errorMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setErrorMessage('')}
                className="p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer shrink-0"
                aria-label="ปิดการแจ้งเตือน"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field (hidden from users, traps bots) */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              type="text"
              id="website"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          {/* 1. Name Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="reviewer-name" className="text-sm font-bold text-pattan-blue-deep dark:text-slate-200">
                ชื่อที่แสดง <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono font-medium">{name.length}/40</span>
            </div>
            <input
              id="reviewer-name"
              type="text"
              required
              maxLength={40}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="เช่น น้องมุก, คุณฟ้า, ลูกค้าประจำร้าน 🌸"
              className="w-full min-h-[50px] px-4 rounded-2xl bg-white/80 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600 shadow-xs text-pattan-blue-deep dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-pattan-blue/20 transition-all font-medium text-sm"
            />
          </div>

          {/* 2. Rating Star Picker */}
          <div>
            <label className="block text-sm font-bold text-pattan-blue-deep dark:text-slate-200 mb-1.5">
              ให้คะแนนความประทับใจ <span className="text-rose-500">*</span>
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/70 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600 shadow-xs w-fit">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const activeRating = hoverRating || rating;
                  const isFilled = starValue <= activeRating;

                  return (
                    <button
                      key={starValue}
                      type="button"
                      onClick={() => setRating(starValue)}
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 min-w-[42px] min-h-[42px] rounded-xl hover:scale-125 active:scale-95 transition-transform duration-200 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-pattan-yellow"
                      aria-label={`ให้คะแนน ${starValue} ดาว`}
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 transition-colors ${
                          isFilled
                            ? 'text-pattan-yellow fill-pattan-yellow drop-shadow-xs'
                            : 'text-slate-200 dark:text-slate-600 fill-transparent'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>

              {/* Dynamic Rating Label */}
              <span className="text-xs sm:text-sm font-semibold text-pattan-blue-deep dark:text-pattan-blue-light bg-pattan-blue/10 dark:bg-slate-700 px-3.5 py-1.5 rounded-full w-fit">
                {RATING_LABELS[hoverRating || rating]}
              </span>
            </div>
          </div>

          {/* 3. Comment Input */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label htmlFor="review-comment" className="text-sm font-bold text-pattan-blue-deep dark:text-slate-200">
                ข้อความรีวิว / ความประทับใจ <span className="text-rose-500">*</span>
              </label>
              <span className="text-xs text-slate-400 font-mono font-medium">{comment.length}/500</span>
            </div>
            <textarea
              id="review-comment"
              required
              rows={4}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="เล่าความประทับใจ เช่น สินค้าน่ารักมาก ตรงปกสุดๆ แม่ค้าใจดีตอบไว แพ็คของมาน่ารักมากเลยค่ะ ประทับใจมาก..."
              className="w-full p-4 rounded-2xl bg-white/80 dark:bg-slate-700/60 border border-slate-200/80 dark:border-slate-600 shadow-xs text-pattan-blue-deep dark:text-white placeholder:text-slate-400 focus:outline-none focus:bg-white focus:ring-4 focus:ring-pattan-blue/20 transition-all resize-none font-medium leading-relaxed text-sm"
            />

            {/* Quick Tag Stamp Chips */}
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 mb-1.5">
                <Sparkles className="w-3 h-3 text-pattan-yellow fill-pattan-yellow" />
                <span>แตะเพื่อใส่คำรีวิวยอดนิยม:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_TAGS.map((tag) => (
                  <button
                    key={tag.label}
                    type="button"
                    onClick={() => handleAddQuickTag(tag.text)}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-white/70 dark:bg-slate-700/60 hover:bg-white hover:text-pattan-blue dark:hover:text-pattan-blue-light border border-slate-200/60 dark:border-slate-600 text-slate-600 dark:text-slate-300 transition-all active:scale-95 shadow-xs cursor-pointer flex items-center gap-1"
                  >
                    <span>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 4. Image Attachments (0-3 images) with Sticker Polaroid Preview */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-bold text-pattan-blue-deep dark:text-slate-200">
                แนบรูปภาพสินค้า/พัสดุ (ไม่บังคับ, สูงสุด 3 รูป)
              </label>
              <span className="text-xs text-slate-400 font-medium">ไม่เกิน 3MB ต่อรูป (JPG, PNG, WebP)</span>
            </div>

            {/* Polaroid Sticker Preview Area */}
            {images.length > 0 && (
              <div className="flex flex-wrap gap-3.5 mb-3">
                {images.map((img, index) => (
                  <div
                    key={img.id}
                    className="relative w-20 h-20 sm:w-24 sm:h-24 p-1.5 bg-white rounded-2xl shadow-sticker -rotate-2 hover:rotate-0 transition-transform group"
                  >
                    <img
                      src={img.previewUrl}
                      alt={`พรีวิวรูปที่ ${index + 1}`}
                      className="w-full h-full object-cover rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(img.id)}
                      className="absolute -top-1.5 -right-1.5 p-1 bg-black/80 hover:bg-rose-600 text-white rounded-full transition shadow-md focus:outline-none"
                      title="ลบรูปภาพนี้"
                      aria-label="ลบรูปภาพนี้"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Upload Box with Camera Icon */}
            {images.length < 3 && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  id="image-upload"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-flex items-center gap-2.5 min-h-[46px] px-5 py-2.5 rounded-2xl border-2 border-dashed border-[#5B86C8]/40 hover:border-pattan-blue bg-white/60 dark:bg-slate-700/40 hover:bg-white/90 cursor-pointer text-sm font-bold text-pattan-blue-deep dark:text-slate-200 transition active:scale-95 shadow-xs"
                >
                  <Camera className="w-4 h-4 text-pattan-pink" />
                  <span>เพิ่มรูปภาพรีวิว ({images.length}/3)</span>
                </label>
              </div>
            )}
          </div>

          {/* 5. Submit Jelly Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-jelly w-full min-h-[52px] px-6 py-3.5 rounded-full bg-gradient-to-r from-pattan-blue via-[#6E99DC] to-pattan-pink disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-base shadow-jelly flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>กำลังส่งรีวิว...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 text-white" />
                  <span className="tracking-wide">ส่งรีวิวให้ร้าน Pattancute</span>
                  <span className="text-pattan-yellow">✨</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import { Star, MessageCircle, ChevronDown, Image as ImageIcon, CheckCircle2, Pencil, X, Share2, MessageSquarePlus } from 'lucide-react';
import { ImageModal } from './ImageModal';
import { getEditToken, decodeHtml } from '../myReviews';

// Modal: customer edits their own review (name, stars, comment)
function EditReviewModal({ review, onClose, onSaved }) {
  const [name, setName] = useState(decodeHtml(review.name));
  const [rating, setRating] = useState(review.rating);
  const [comment, setComment] = useState(decodeHtml(review.comment));
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    if (!name.trim()) return setError('กรุณากรอกชื่อของคุณ');
    if (!comment.trim()) return setError('กรุณากรอกข้อความรีวิว');

    setIsSaving(true);
    try {
      const res = await fetch(`/api/reviews/${review.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          editToken: getEditToken(review.id),
          name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'แก้ไขรีวิวไม่สำเร็จ กรุณาลองใหม่ค่ะ');
      onSaved({ ...review, ...data.review });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in font-sans"
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={handleSave}
        className="bg-white dark:bg-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl border border-white/80 dark:border-slate-700 animate-modal-pop"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-black text-pattan-blue-deep dark:text-white flex items-center gap-2">
            <Pencil className="w-4 h-4 text-pattan-pink" />
            แก้ไขรีวิวของฉัน
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-center text-slate-400"
            aria-label="ปิด"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">ชื่อที่แสดง</label>
        <input
          type="text"
          value={name}
          maxLength={40}
          onChange={(e) => setName(e.target.value)}
          className="w-full h-10 px-3.5 mb-4 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm font-semibold"
        />

        <label className="block text-xs font-bold text-slate-700 dark:text-slate-200 mb-1">คะแนน</label>
        <div className="flex items-center gap-1 mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setRating(s)}
              className="p-0.5 active:scale-90 transition-transform"
              aria-label={`${s} ดาว`}
            >
              <Star
                className={`w-7 h-7 ${
                  s <= rating ? 'text-pattan-yellow fill-pattan-yellow' : 'text-slate-200 fill-slate-200 dark:text-slate-600 dark:fill-slate-600'
                }`}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-200">ข้อความรีวิว</label>
          <span className="text-[11px] text-slate-400">{comment.length}/500</span>
        </div>
        <textarea
          value={comment}
          maxLength={500}
          rows={4}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-sm resize-none"
        />

        {error && <p className="mt-2 text-xs font-semibold text-rose-500">{error}</p>}

        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-full bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-xs font-bold text-slate-600 dark:text-slate-300"
          >
            ยกเลิก
          </button>
          <button
            type="submit"
            disabled={isSaving}
            className="h-10 rounded-full bg-gradient-to-r from-pattan-blue to-pattan-pink text-white text-xs font-bold shadow-sm disabled:opacity-50"
          >
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการแก้ไข'}
          </button>
        </div>
      </form>
    </div>
  );
}

// Helper: Format real Thai calendar date from database timestamp (e.g. "18 พ.ย. 2569")
const THAI_MONTHS_SHORT = [
  'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
  'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
];

function formatThaiDate(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(d);
    }
    const utc = d.getTime() + d.getTimezoneOffset() * 60000;
    const bkk = new Date(utc + 3600000 * 7);
    return `${bkk.getDate()} ${THAI_MONTHS_SHORT[bkk.getMonth()]} ${bkk.getFullYear() + 543}`;
  } catch (e) {
    return '';
  }
}

function formatThaiFullDateTime(isoString) {
  if (!isoString) return '';
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return '';
    if (typeof Intl !== 'undefined' && Intl.DateTimeFormat) {
      return new Intl.DateTimeFormat('th-TH', {
        timeZone: 'Asia/Bangkok',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }).format(d) + ' น.';
    }
    return formatThaiDate(isoString);
  } catch (e) {
    return '';
  }
}

// Pastel Candy Avatars
const AVATAR_PALETTE = [
  'bg-[#FFE0EC] text-[#D84A85] border-[#FFC2DA]',
  'bg-[#FFF5BF] text-[#9E7C00] border-[#FFE97D]',
  'bg-[#E0ECFF] text-[#3B6DB8] border-[#BED5FF]',
  'bg-[#E2F8DA] text-[#388A22] border-[#C2EEB3]',
  'bg-[#F0E6FF] text-[#7B42BC] border-[#D9C4FF]',
];

function getAvatarStyle(name) {
  let hash = 0;
  for (let i = 0; i < (name || '').length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

// Animated Review Card Component with IntersectionObserver
function AnimatedReviewCard({ review, index, onImageClick, onEdit }) {
  const cardRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const canEdit = !!getEditToken(review.id);

  useEffect(() => {
    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  const avatarStyle = getAvatarStyle(review.name);
  const initial = (review.name || 'L').charAt(0).toUpperCase();

  return (
    <article
      ref={cardRef}
      style={{ transitionDelay: `${Math.min(index * 60, 300)}ms` }}
      className={`card-bento relative overflow-hidden p-5 sm:p-6 transition-all duration-500 ease-out hover:border-pattan-pink/35 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
      }`}
    >
      {/* Review Header: Avatar, Name, Rating, Real Date */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          {/* Pastel Avatar */}
          <div
            className={`w-11 h-11 rounded-2xl border-2 flex items-center justify-center font-black text-base shadow-xs ${avatarStyle}`}
          >
            {initial}
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <h4 className="font-black text-pattan-blue-deep dark:text-white text-base leading-snug">
                {review.name}
              </h4>
              <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                <span>รีวิวจริง</span>
              </span>
            </div>

            {/* Rating Stars */}
            <div className="flex items-center gap-0.5 mt-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-4 h-4 ${
                    s <= review.rating
                      ? 'text-pattan-yellow fill-pattan-yellow drop-shadow-xs'
                      : 'text-slate-200 dark:text-slate-700 fill-slate-200 dark:fill-slate-700'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Real Date badge (+ edited mark) */}
        {review.created_at && (
          <div className="flex flex-col items-end gap-0.5 shrink-0 pt-0.5">
            <span
              title={formatThaiFullDateTime(review.created_at)}
              className="text-xs font-semibold text-slate-500 dark:text-slate-400 bg-slate-100/80 dark:bg-slate-700/60 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-600/60 shadow-2xs"
            >
              {formatThaiDate(review.created_at)}
            </span>
            {review.updated_at && (
              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">(แก้ไขแล้ว)</span>
            )}
          </div>
        )}
      </div>

      {/* Comment Text */}
      <p className="text-pattan-text-body dark:text-slate-200 text-sm sm:text-base leading-relaxed whitespace-pre-line break-words pl-0.5 font-medium">
        {review.comment}
      </p>

      {/* Attached Images Grid */}
      {review.images && review.images.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2.5 pl-0.5">
          {review.images.map((imgUrl, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onImageClick(imgUrl)}
              className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 hover:scale-[1.03] active:scale-95 transition-all group focus:outline-none focus:ring-2 focus:ring-pattan-blue shadow-xs"
              title="คลิกเพื่อดูรูปขนาดเต็ม"
              aria-label={`ดูรูปภาพที่ ${idx + 1}`}
            >
              <img
                src={imgUrl}
                alt={`รูปรีวิวโดย ${review.name} ${idx + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-slate-900/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <ImageIcon className="w-5 h-5 drop-shadow" />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Owner-only edit action */}
      {canEdit && (
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => onEdit(review)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-pattan-pink-soft dark:bg-slate-700 border border-pink-200/80 dark:border-slate-600 text-xs font-bold text-pattan-pink-deep dark:text-pattan-pink hover:bg-pattan-pink-light active:scale-95 transition"
          >
            <Pencil className="w-3.5 h-3.5" />
            แก้ไขรีวิวของฉัน
          </button>
        </div>
      )}
    </article>
  );
}

export function ReviewList({
  reviews = [],
  isLoadingInitial,
  isLoadingMore,
  hasMore,
  onLoadMore,
  onScrollToForm,
  onReviewUpdated,
}) {
  const [activeImage, setActiveImage] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [selectedStar, setSelectedStar] = useState(null); // null = All, 5, 4, 3, 2, 1
  const [copiedReviewsLink, setCopiedReviewsLink] = useState(false);

  // Copy direct link to reviews section (#reviews)
  const handleCopyReviewsLink = async () => {
    const url = `${window.location.origin}/#reviews`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const ta = document.createElement('textarea');
        ta.value = url;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      setCopiedReviewsLink(true);
      setTimeout(() => setCopiedReviewsLink(false), 3000);
    } catch (e) {
      console.warn('Copy link failed', e);
    }
  };

  // Filter reviews client-side
  const filteredReviews = selectedStar
    ? reviews.filter((r) => r.rating === selectedStar)
    : reviews;

  return (
    <section id="reviews-section" className="relative w-full max-w-3xl mx-auto px-4 mb-16 scroll-mt-20 font-sans">
      {/* Anchor for #reviews deep link */}
      <span id="reviews" className="absolute -top-24" />

      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-pattan-blue-soft dark:bg-slate-800 border border-pattan-blue/15 flex items-center justify-center text-pattan-blue">
            <MessageCircle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-pattan-blue-deep dark:text-white font-display">
              รีวิวและความประทับใจจากลูกค้า
            </h2>
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
              ความคิดเห็นจริงจากผู้ใช้บริการ เรียงจากล่าสุด
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {reviews.length > 0 && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-pattan-blue/20 text-pattan-blue-deep dark:text-pattan-blue-light shadow-xs">
              ทั้งหมด {reviews.length} รีวิว
            </span>
          )}

          <button
            type="button"
            onClick={handleCopyReviewsLink}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:text-pattan-blue hover:border-pattan-blue/50 active:scale-95 transition shadow-xs cursor-pointer"
            title="คัดลอกลิงก์ตรงมาหน้ารีวิวนี้"
          >
            {copiedReviewsLink ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">คัดลอกลิงก์แล้ว! ✨</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5 text-pattan-blue" />
                <span>แชร์ลิงก์รีวิว</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Star Filter Chips */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none select-none">
          <button
            type="button"
            onClick={() => setSelectedStar(null)}
            className={`min-h-[36px] px-3.5 rounded-full text-xs font-black transition-all shrink-0 active:scale-95 ${
              selectedStar === null
                ? 'bg-pattan-blue text-white shadow-xs'
                : 'bg-white/80 dark:bg-slate-800/80 text-pattan-text-body hover:bg-white border border-white'
            }`}
          >
            ทั้งหมด ({reviews.length})
          </button>

          {[5, 4, 3, 2, 1].map((s) => {
            const count = reviews.filter((r) => r.rating === s).length;
            const isSelected = selectedStar === s;

            return (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedStar(isSelected ? null : s)}
                className={`min-h-[36px] px-3.5 rounded-full text-xs font-black transition-all shrink-0 active:scale-95 flex items-center gap-1 ${
                  isSelected
                    ? 'bg-gradient-to-r from-pattan-pink to-[#E06B9A] text-white shadow-xs'
                    : 'bg-white/80 dark:bg-slate-800/80 text-pattan-text-body hover:bg-white border border-white'
                }`}
              >
                <span>{s}</span>
                <Star className={`w-3.5 h-3.5 ${isSelected ? 'fill-white text-white' : 'text-pattan-yellow fill-pattan-yellow'}`} />
                <span className="text-[11px] opacity-80">({count})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* 1. Initial Pastel Skeleton Loading */}
      {isLoadingInitial ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="card-bento p-6 animate-pulse space-y-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FFE0EC] to-[#E0ECFF]" />
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 bg-slate-200/80 rounded-full" />
                  <div className="h-3 w-20 bg-slate-200/60 rounded-full" />
                </div>
              </div>
              <div className="h-4 w-full bg-slate-200/60 rounded-full" />
              <div className="h-4 w-2/3 bg-slate-200/50 rounded-full" />
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        /* 2. Refined Clean Empty State */
        <div className="card-bento p-8 sm:p-10 text-center">
          <div className="w-12 h-12 rounded-2xl bg-pattan-blue-soft dark:bg-slate-800 border border-pattan-blue/15 text-pattan-blue flex items-center justify-center mx-auto mb-4">
            <MessageSquarePlus className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-extrabold text-pattan-blue-deep dark:text-white font-display">
            ยังไม่มีรีวิวในขณะนี้
          </h3>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
            หากเคยใช้บริการกับทางร้าน สามารถร่วมแบ่งปันประสบการณ์เพื่อเป็นข้อมูลให้ลูกค้าท่านอื่นได้เลยค่ะ
          </p>
          <button
            onClick={onScrollToForm}
            type="button"
            className="btn-jelly btn-signature mt-5 min-h-[44px] px-6 py-2.5 rounded-xl text-white font-bold text-xs inline-flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-pattan-pink-light" />
            <span>เขียนรีวิวคนแรก</span>
          </button>
        </div>
      ) : filteredReviews.length === 0 ? (
        /* Filtered Empty State */
        <div className="card-bento p-8 text-center">
          <p className="text-sm font-bold text-pattan-text-muted">
            ยังไม่มีรีวิวที่ให้ {selectedStar} ดาวค่ะ 🌸
          </p>
          <button
            onClick={() => setSelectedStar(null)}
            type="button"
            className="mt-3 text-xs font-black text-pattan-blue underline"
          >
            ดูรีวิวทั้งหมด
          </button>
        </div>
      ) : (
        /* 3. Staggered Animated Review Cards */
        <div className="space-y-4">
          {filteredReviews.map((rev, index) => (
            <AnimatedReviewCard
              key={rev.id}
              review={rev}
              index={index}
              onImageClick={(imgUrl) => setActiveImage(imgUrl)}
              onEdit={(r) => setEditingReview(r)}
            />
          ))}

          {/* Load More Button (10 at a time) */}
          {hasMore && selectedStar === null && (
            <div className="pt-4 text-center">
              <button
                onClick={onLoadMore}
                disabled={isLoadingMore}
                type="button"
                className="btn-jelly min-h-[48px] px-8 py-3 rounded-full bg-white/90 dark:bg-slate-800 hover:bg-white active:scale-95 border border-white text-pattan-blue-deep font-black text-sm shadow-bento flex items-center justify-center gap-2 mx-auto disabled:opacity-60"
              >
                {isLoadingMore ? (
                  <>
                    <div className="w-4 h-4 border-2 border-pattan-blue border-t-transparent rounded-full animate-spin" />
                    <span>กำลังโหลดรีวิวเพิ่มเติม...</span>
                  </>
                ) : (
                  <>
                    <span>ดูเพิ่มเติมทีละ 10 รีวิว</span>
                    <ChevronDown className="w-4 h-4 text-pattan-pink" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Lightbox Image Modal */}
      {activeImage && (
        <ImageModal
          src={activeImage}
          onClose={() => setActiveImage(null)}
        />
      )}

      {/* Customer Edit Review Modal */}
      {editingReview && (
        <EditReviewModal
          review={editingReview}
          onClose={() => setEditingReview(null)}
          onSaved={(updated) => {
            setEditingReview(null);
            if (onReviewUpdated) onReviewUpdated(updated);
          }}
        />
      )}
    </section>
  );
}

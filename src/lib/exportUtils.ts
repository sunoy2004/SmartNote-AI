/**
 * Export Utilities
 * Functions for exporting notes to various formats
 */

/**
 * Export note as PDF using jsPDF
 * @param note - Note object with title, content, summary, etc.
 */
export const downloadNoteAsPdf = async (note: {
  title: string;
  content: string;
  summary: string;
  subject: string;
  date: string;
  transcript?: string;
}) => {
  // Dynamic import to avoid bundling jsPDF if not used
  const { jsPDF } = await import("jspdf");
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - 2 * margin;
  let yPosition = margin;

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(note.title, margin, yPosition);
  yPosition += 10;

  // Subject and Date
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Subject: ${note.subject}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${new Date(note.date).toLocaleDateString()}`, margin, yPosition);
  yPosition += 10;

  // Summary
  if (note.summary) {
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Summary", margin, yPosition);
    yPosition += 7;
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    const summaryLines = doc.splitTextToSize(note.summary, maxWidth);
    doc.text(summaryLines, margin, yPosition);
    yPosition += summaryLines.length * 5 + 5;
  }

  // Content
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Notes", margin, yPosition);
  yPosition += 7;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const contentLines = doc.splitTextToSize(note.content, maxWidth);
  doc.text(contentLines, margin, yPosition);
  yPosition += contentLines.length * 5;

  // Check if we need a new page
  if (yPosition > doc.internal.pageSize.getHeight() - margin) {
    doc.addPage();
    yPosition = margin;
  }

  // Transcript (optional)
  if (note.transcript) {
    yPosition += 5;
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Full Transcript", margin, yPosition);
    yPosition += 7;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    const transcriptLines = doc.splitTextToSize(note.transcript, maxWidth);
    doc.text(transcriptLines, margin, yPosition);
  }

  // Save PDF
  doc.save(`${note.title.replace(/[^a-z0-9]/gi, "_")}.pdf`);
};

/**
 * Copy note content to clipboard
 * @param text - Text to copy
 * @returns Promise that resolves when text is copied
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);
  }
};

/**
 * Share note using Web Share API (mobile) or fallback to copy
 * @param note - Note object
 * @returns Promise that resolves when shared
 */
export const shareNote = async (note: {
  title: string;
  content: string;
  summary: string;
}): Promise<void> => {
  const shareData = {
    title: note.title,
    text: `${note.summary}\n\n${note.content}`,
  };

  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
    } catch (err) {
      // User cancelled or error occurred
      console.error("Error sharing:", err);
      // Fallback to copy
      await copyToClipboard(`${note.title}\n\n${shareData.text}`);
    }
  } else {
    // Fallback to copy
    await copyToClipboard(`${note.title}\n\n${shareData.text}`);
  }
};


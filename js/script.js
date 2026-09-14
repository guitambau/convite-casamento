// Preencha os dados abaixo para finalizar o convite.
// A data deve seguir o formato: AAAA-MM-DDTHH:mm:ss-03:00.
const dinnerConfig = {
    date: '2026-10-24T17:00:00-03:00',
    endDate: '2026-10-24T20:00:00-03:00',
    venue: 'Rua Rui Sérgio Rogrigues de Moura, 942',
    address: 'Condominio Portal da Serra - Urbanova - SJC',
    heroBackgroundUrl: 'assets/images/back.jpeg',
    mapsUrl: 'https://maps.app.goo.gl/z8nCoDZRz23R7yE66',
    rsvpUrl: '',
    calendar: {
        filename: 'jantar-padrinhos-isabelle-guilherme.ics',
        title: 'Jantar dos Padrinhos — Isabelle & Guilherme',
        description: 'Uma noite especial para brindar com Isabelle e Guilherme.'
    }
};

function getEventDate() {
    if (!dinnerConfig.date) {
        return null;
    }

    const date = new Date(dinnerConfig.date);
    return Number.isNaN(date.getTime()) ? null : date;
}

function setEventContent() {
    const eventDate = getEventDate();
    const heroDate = document.getElementById('event-date-display');
    const detailDate = document.getElementById('detail-date');
    const detailTime = document.getElementById('detail-time');
    const detailVenue = document.getElementById('detail-venue');
    const detailAddress = document.getElementById('detail-address');

    if (detailVenue) detailVenue.textContent = dinnerConfig.venue || 'Local a confirmar';
    if (detailAddress) detailAddress.textContent = dinnerConfig.address || '';

    if (!eventDate) {
        if (heroDate) heroDate.textContent = 'Data a confirmar';
        if (detailDate) detailDate.textContent = 'A confirmar';
        if (detailTime) detailTime.textContent = 'A confirmar';
        return;
    }

    const dateText = new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    }).format(eventDate);
    const shortDateText = new Intl.DateTimeFormat('pt-BR', {
        weekday: 'long',
        day: '2-digit',
        month: 'long'
    }).format(eventDate);
    const timeText = new Intl.DateTimeFormat('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(eventDate);

    if (heroDate) heroDate.textContent = dateText;
    if (detailDate) detailDate.textContent = shortDateText;
    if (detailTime) detailTime.textContent = timeText;
}

function configureLink(id, url, placeholderTitle) {
    const element = document.getElementById(id);

    if (!element) return;

    const isPlaceholder = !url || url === '#';
    element.href = isPlaceholder ? '#' : url;
    element.setAttribute('aria-disabled', String(isPlaceholder));
    element.title = isPlaceholder ? placeholderTitle : '';
    element.target = isPlaceholder ? '_self' : '_blank';
    element.rel = isPlaceholder ? '' : 'noreferrer noopener';

    if (isPlaceholder) {
        element.addEventListener('click', (event) => event.preventDefault());
    }
}

function setConfiguredLinks() {
    configureLink('maps-link', dinnerConfig.mapsUrl, 'Adicione o link do local em js/script.js');
    configureLink('rsvp-link', dinnerConfig.rsvpUrl, 'Adicione o link de confirmação em js/script.js');
}

function setOpenGraphUrl() {
    const openGraphUrl = document.querySelector('meta[property="og:url"]');
    if (openGraphUrl) openGraphUrl.content = window.location.href;
}

function setHeroBackground() {
    if (!dinnerConfig.heroBackgroundUrl) return;

    const heroBackground = document.querySelector('.hero__background');
    if (!heroBackground) return;

    heroBackground.style.backgroundImage = `url('${dinnerConfig.heroBackgroundUrl}')`;
    heroBackground.classList.add('has-image');
}

function formatCountdownPart(value, minimumDigits = 2) {
    return String(Math.max(0, value)).padStart(minimumDigits, '0');
}

function updateCountdown() {
    const targetDate = getEventDate();
    const display = document.getElementById('countdown-display');
    const labels = document.getElementById('countdown-labels');
    const complete = document.getElementById('countdown-complete');
    const message = document.getElementById('countdown-message');
    const fields = {
        days: document.getElementById('countdown-days'),
        hours: document.getElementById('countdown-hours'),
        minutes: document.getElementById('countdown-minutes'),
        seconds: document.getElementById('countdown-seconds')
    };

    if (!display || !labels || !complete || !message) return;

    if (!targetDate) {
        display.classList.add('is-hidden');
        labels.classList.add('is-hidden');
        message.textContent = 'A data será revelada em breve.';
        return;
    }

    let intervalId = null;

    const update = () => {
        const difference = targetDate.getTime() - Date.now();

        if (difference <= 0) {
            display.classList.add('is-hidden');
            labels.classList.add('is-hidden');
            complete.classList.remove('is-hidden');
            message.textContent = 'A mesa está posta. Esperamos vocês!';
            if (intervalId !== null) window.clearInterval(intervalId);
            return true;
        }

        const totalSeconds = Math.floor(difference / 1000);
        fields.days.textContent = formatCountdownPart(Math.floor(totalSeconds / 86400));
        fields.hours.textContent = formatCountdownPart(Math.floor((totalSeconds % 86400) / 3600));
        fields.minutes.textContent = formatCountdownPart(Math.floor((totalSeconds % 3600) / 60));
        fields.seconds.textContent = formatCountdownPart(totalSeconds % 60);
        display.classList.remove('is-hidden');
        labels.classList.remove('is-hidden');
        complete.classList.add('is-hidden');
        message.textContent = 'Até brindarmos juntos.';
        return false;
    };

    if (!update()) intervalId = window.setInterval(update, 1000);
}

function toUtcIcsDate(dateString) {
    return new Date(dateString).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

function escapeIcsText(value) {
    return String(value)
        .replace(/\\/g, '\\\\')
        .replace(/\r?\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');
}

function foldIcsLine(line) {
    const maxLength = 75;
    if (line.length <= maxLength) return line;

    const parts = [];
    for (let index = 0; index < line.length; index += maxLength) {
        parts.push(`${index === 0 ? '' : ' '}${line.slice(index, index + maxLength)}`);
    }
    return parts.join('\r\n');
}

function setupCalendarLink() {
    const link = document.getElementById('calendar-link');
    const eventDate = getEventDate();
    if (!link) return;

    if (!eventDate) {
        link.href = '#';
        link.setAttribute('aria-disabled', 'true');
        link.title = 'Adicione a data do jantar em js/script.js';
        link.addEventListener('click', (event) => event.preventDefault());
        return;
    }

    const start = toUtcIcsDate(dinnerConfig.date);
    const fallbackEnd = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000).toISOString();
    const end = toUtcIcsDate(dinnerConfig.endDate || fallbackEnd);
    const timestamp = toUtcIcsDate(new Date().toISOString());
    const location = [dinnerConfig.venue, dinnerConfig.address].filter(Boolean).join(' — ');
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Isabelle e Guilherme//Jantar dos Padrinhos//PT-BR',
        'BEGIN:VEVENT',
        `UID:jantar-padrinhos-${start}@isabelle-guilherme`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${escapeIcsText(dinnerConfig.calendar.title)}`,
        `DESCRIPTION:${escapeIcsText(dinnerConfig.calendar.description)}`,
        `LOCATION:${escapeIcsText(location)}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];
    const blob = new Blob([lines.map(foldIcsLine).join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    link.href = downloadUrl;
    link.download = dinnerConfig.calendar.filename;
    link.setAttribute('aria-disabled', 'false');
    window.addEventListener('beforeunload', () => URL.revokeObjectURL(downloadUrl));
}

function setupRevealAnimations() {
    const elements = document.querySelectorAll('.reveal');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        elements.forEach((element) => element.classList.add('is-visible'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -24px 0px' });

    elements.forEach((element) => observer.observe(element));
}

function initializePage() {
    setOpenGraphUrl();
    setEventContent();
    setConfiguredLinks();
    setHeroBackground();
    updateCountdown();
    setupCalendarLink();
    setupRevealAnimations();
}

initializePage();

const weddingConfig = {
    date: '2027-08-14T16:00:00-03:00',
    endDate: '2027-08-14T23:59:00-03:00',
    heroBackgroundUrl: '', // TODO: adicionar caminho relativo da foto principal, ex.: 'assets/images/hero-image.webp'
    mapsUrl: '#', // TODO: substituir pelo link real do Google Maps da cerimônia
    receptionMapsUrl: '#', // TODO: substituir pelo link real do Google Maps da recepção, se desejar
    rsvpUrl: '#', // TODO: substituir pelo link real de confirmação de presença
    giftsUrl: '#', // TODO: substituir pelo link real da lista de presentes
    calendar: {
        filename: 'casamento-isabelle-guilherme.ics',
        title: 'Casamento Isabelle & Guilherme',
        description: 'Celebre com Isabelle & Guilherme este momento especial.',
        location: 'Espaço Canto Verde - Caçapava/SP'
    }
};

const configuredLinks = [
    { id: 'maps-link', url: weddingConfig.mapsUrl },
    { id: 'reception-maps-link', url: weddingConfig.receptionMapsUrl || weddingConfig.mapsUrl },
    { id: 'rsvp-link', url: weddingConfig.rsvpUrl },
    { id: 'gifts-link', url: weddingConfig.giftsUrl }
];

function setConfiguredLinks() {
    configuredLinks.forEach(({ id, url }) => {
        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        const isPlaceholder = !url || url === '#';
        element.href = isPlaceholder ? '#' : url;
        element.setAttribute('aria-disabled', String(isPlaceholder));
        element.title = isPlaceholder ? 'Atualize o link correspondente em js/script.js' : '';

        if (isPlaceholder) {
            element.addEventListener('click', (event) => event.preventDefault());
        }
    });
}

function setOpenGraphUrl() {
    const openGraphUrl = document.querySelector('meta[property="og:url"]');

    if (!openGraphUrl) {
        return;
    }

    openGraphUrl.content = window.location.href;
}

function setHeroBackground() {
    if (!weddingConfig.heroBackgroundUrl) {
        return;
    }

    const heroBackground = document.querySelector('.hero__background');

    if (!heroBackground) {
        return;
    }

    heroBackground.style.backgroundImage = `url('${weddingConfig.heroBackgroundUrl}')`;
    heroBackground.classList.add('has-image');
}

function formatCountdownPart(value, minimumDigits = 2) {
    return String(Math.max(0, value)).padStart(minimumDigits, '0');
}

function updateCountdown() {
    const targetDate = new Date(weddingConfig.date);
    const countdownDisplay = document.getElementById('countdown-display');
    const countdownDays = document.getElementById('countdown-days');
    const countdownHours = document.getElementById('countdown-hours');
    const countdownMinutes = document.getElementById('countdown-minutes');
    const countdownSeconds = document.getElementById('countdown-seconds');
    const countdownLabels = document.getElementById('countdown-labels');
    const countdownComplete = document.getElementById('countdown-complete');
    const countdownMessage = document.getElementById('countdown-message');

    if (
        !countdownDisplay ||
        !countdownDays ||
        !countdownHours ||
        !countdownMinutes ||
        !countdownSeconds ||
        !countdownLabels ||
        !countdownComplete ||
        !countdownMessage ||
        Number.isNaN(targetDate.getTime())
    ) {
        return;
    }

    let intervalId;

    const update = () => {
        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            countdownDisplay.classList.add('is-hidden');
            countdownLabels.classList.add('is-hidden');
            countdownComplete.classList.remove('is-hidden');
            countdownMessage.textContent = 'O grande dia chegou. Estamos prontos para celebrar!';
            window.clearInterval(intervalId);
            return;
        }

        const totalSeconds = Math.floor(difference / 1000);
        const days = Math.floor(totalSeconds / 86400);
        const hours = Math.floor((totalSeconds % 86400) / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;

        countdownDisplay.classList.remove('is-hidden');
        countdownLabels.classList.remove('is-hidden');
        countdownComplete.classList.add('is-hidden');
        countdownDays.textContent = formatCountdownPart(days);
        countdownHours.textContent = formatCountdownPart(hours);
        countdownMinutes.textContent = formatCountdownPart(minutes);
        countdownSeconds.textContent = formatCountdownPart(seconds);
        countdownMessage.textContent = 'Até celebrarmos juntos este dia inesquecível.';
    };

    intervalId = window.setInterval(update, 1000);
    update();
}

function toUtcIcsDate(dateString) {
    const date = new Date(dateString);

    return date
        .toISOString()
        .replace(/[-:]/g, '')
        .replace(/\.\d{3}/, '');
}

function buildCalendarFile() {
    const start = toUtcIcsDate(weddingConfig.date);
    const end = toUtcIcsDate(weddingConfig.endDate || weddingConfig.date);
    const timestamp = toUtcIcsDate(new Date().toISOString());
    const uid = `casamento-isabelle-guilherme-${start}@convite-casamento`;
    const lines = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Isabelle e Guilherme//Convite Casamento//PT-BR',
        'BEGIN:VEVENT',
        `UID:${uid}`,
        `DTSTAMP:${timestamp}`,
        `DTSTART:${start}`,
        `DTEND:${end}`,
        `SUMMARY:${weddingConfig.calendar.title}`,
        `DESCRIPTION:${weddingConfig.calendar.description}`,
        `LOCATION:${weddingConfig.calendar.location}`,
        'END:VEVENT',
        'END:VCALENDAR'
    ];

    return lines.join('\r\n');
}

function setupCalendarLink() {
    const calendarLink = document.getElementById('calendar-link');

    if (!calendarLink) {
        return;
    }

    const calendarFile = buildCalendarFile();
    const blob = new Blob([calendarFile], { type: 'text/calendar;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);

    calendarLink.href = downloadUrl;
    calendarLink.download = weddingConfig.calendar.filename;

    window.addEventListener('beforeunload', () => {
        URL.revokeObjectURL(downloadUrl);
    });
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
            if (!entry.isIntersecting) {
                return;
            }

            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, {
        threshold: 0.2,
        rootMargin: '0px 0px -32px 0px'
    });

    elements.forEach((element) => observer.observe(element));
}

function initializePage() {
    setOpenGraphUrl();
    setConfiguredLinks();
    setHeroBackground();
    updateCountdown();
    setupCalendarLink();
    setupRevealAnimations();
}

initializePage();

-- CreateTable
CREATE TABLE "Subject" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameTk" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameRu" TEXT NOT NULL,
    "icon" TEXT,

    CONSTRAINT "Subject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subject_slug_key" ON "Subject"("slug");

-- Implicit many-to-many join table (Prisma names columns A/B, alphabetically:
-- A = Offering, B = Subject).
CREATE TABLE "_OfferingToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_OfferingToSubject_AB_unique" ON "_OfferingToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_OfferingToSubject_B_index" ON "_OfferingToSubject"("B");

-- AddForeignKey
ALTER TABLE "_OfferingToSubject" ADD CONSTRAINT "_OfferingToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "Offering"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_OfferingToSubject" ADD CONSTRAINT "_OfferingToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "Subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Seed the starting subject set (icons are Material Symbols names).
INSERT INTO "Subject" ("id", "slug", "nameTk", "nameEn", "nameRu", "icon") VALUES
    ('language', 'language', 'Diller',     'Language', 'Языки',       'language'),
    ('it',       'it',       'IT',         'IT',       'IT',          'computer'),
    ('math',     'math',     'Matematika', 'Math',     'Математика',  'functions'),
    ('music',    'music',    'Saz',        'Music',    'Музыка',      'music_note'),
    ('art',      'art',      'Sungat',     'Art',      'Искусство',   'palette'),
    ('business', 'business', 'Biznes',     'Business', 'Бизнес',      'work'),
    ('exam',     'exam',     'Synag',      'Exam prep','Подготовка',  'school');

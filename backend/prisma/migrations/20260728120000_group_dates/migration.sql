-- Add per-group calendar dates: start date, duration in weeks, and the
-- enrollment window (kabul edilişik). All nullable — existing groups keep none.
ALTER TABLE "Group" ADD COLUMN "startDate" DATE;
ALTER TABLE "Group" ADD COLUMN "durationWeeks" INTEGER;
ALTER TABLE "Group" ADD COLUMN "enrollFrom" DATE;
ALTER TABLE "Group" ADD COLUMN "enrollUntil" DATE;

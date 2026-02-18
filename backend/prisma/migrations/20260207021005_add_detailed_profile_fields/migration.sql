-- AlterTable
ALTER TABLE "Preference" ADD COLUMN "bodyType" TEXT;
ALTER TABLE "Preference" ADD COLUMN "children" TEXT;
ALTER TABLE "Preference" ADD COLUMN "drinking" TEXT;
ALTER TABLE "Preference" ADD COLUMN "heightRange" TEXT;
ALTER TABLE "Preference" ADD COLUMN "importantValues" TEXT;
ALTER TABLE "Preference" ADD COLUMN "jobStatus" TEXT;
ALTER TABLE "Preference" ADD COLUMN "minEducationLevel" TEXT;
ALTER TABLE "Preference" ADD COLUMN "openToDistance" TEXT;
ALTER TABLE "Preference" ADD COLUMN "personalityType" TEXT;
ALTER TABLE "Preference" ADD COLUMN "preferredCities" TEXT;
ALTER TABLE "Preference" ADD COLUMN "relationshipGoal" TEXT;
ALTER TABLE "Preference" ADD COLUMN "relationshipStatus" TEXT;
ALTER TABLE "Preference" ADD COLUMN "religion" TEXT;
ALTER TABLE "Preference" ADD COLUMN "religiousPractice" TEXT;
ALTER TABLE "Preference" ADD COLUMN "smoking" TEXT;
ALTER TABLE "Preference" ADD COLUMN "sports" TEXT;
ALTER TABLE "Preference" ADD COLUMN "temperament" TEXT;
ALTER TABLE "Preference" ADD COLUMN "wantsChildren" TEXT;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Profile" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "pseudo" TEXT,
    "age" INTEGER NOT NULL,
    "gender" TEXT NOT NULL,
    "orientation" TEXT,
    "languages" TEXT,
    "country" TEXT,
    "city" TEXT,
    "location" TEXT,
    "mobility" TEXT,
    "relationshipGoal" TEXT,
    "openToDistance" TEXT,
    "personalityType" TEXT,
    "temperament" TEXT,
    "humorImportance" TEXT,
    "relationshipStatus" TEXT,
    "children" TEXT,
    "wantsChildren" TEXT,
    "educationLevel" TEXT,
    "profession" TEXT,
    "jobStatus" TEXT,
    "religion" TEXT,
    "religiousPractice" TEXT,
    "values" TEXT,
    "height" TEXT,
    "bodyType" TEXT,
    "style" TEXT,
    "smoking" TEXT,
    "drinking" TEXT,
    "sports" TEXT,
    "goingOut" TEXT,
    "profileVisibility" TEXT DEFAULT 'Public',
    "messageSettings" TEXT DEFAULT 'Matchs seulement',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "idVerified" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" TEXT NOT NULL DEFAULT 'Actif',
    "activityLevel" TEXT NOT NULL DEFAULT 'Nouveau',
    "isPremium" BOOLEAN NOT NULL DEFAULT false,
    "isBoosted" BOOLEAN NOT NULL DEFAULT false,
    "bio" TEXT,
    "contactInfo" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Profile" ("age", "bio", "contactInfo", "gender", "id", "isPremium", "location", "name", "profession", "religion", "updatedAt", "userId", "verified") SELECT "age", "bio", "contactInfo", "gender", "id", "isPremium", "location", "name", "profession", "religion", "updatedAt", "userId", "verified" FROM "Profile";
DROP TABLE "Profile";
ALTER TABLE "new_Profile" RENAME TO "Profile";
CREATE UNIQUE INDEX "Profile_userId_key" ON "Profile"("userId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

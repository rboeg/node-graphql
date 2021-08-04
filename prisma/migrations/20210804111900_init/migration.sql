-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "first_name" VARCHAR(128) NOT NULL,
    "last_name" VARCHAR(128) NOT NULL,
    "is_landlord" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apartment" (
    "id" SERIAL NOT NULL,
    "title" VARCHAR(128) NOT NULL,
    "description" VARCHAR(128),
    "city" VARCHAR(128) NOT NULL,
    "user_id" INTEGER NOT NULL,
    "n_bedrooms" INTEGER NOT NULL,
    "n_bathrooms" INTEGER NOT NULL,
    "area_m2" DECIMAL(8,3) NOT NULL,
    "month_rent_eur" INTEGER NOT NULL,
    "latitude" DECIMAL(12,8),
    "longitude" DECIMAL(12,8),
    "avail_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted" TIMESTAMP(3),

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorite" (
    "user_id" INTEGER NOT NULL,
    "apartment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "deleted" TIMESTAMP(3),

    PRIMARY KEY ("user_id","apartment_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user.email_unique" ON "user"("email");

-- AddForeignKey
ALTER TABLE "apartment" ADD FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite" ADD FOREIGN KEY ("apartment_id") REFERENCES "apartment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

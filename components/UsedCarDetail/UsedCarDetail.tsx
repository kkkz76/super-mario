"use client";

import HandleShortlistUI from "@/app/boundaries/BuyerUI/HandleShortlistUI";
import { Button } from "@/components/ui/button";
import { ViewShortlistController } from "@/controls/ShortlistControllers/ViewShortlistController";
import { UsedCarListing } from "@prisma/client";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";

interface UsedCarDetailProps {
  car: UsedCarListing;
}

const UsedCarDetail = ({ car }: UsedCarDetailProps) => {
  const router = useRouter();
  const [liked, setLiked] = useState(false);
  const [modal, setModal] = useState<JSX.Element | null>(null);
  const controller = ViewShortlistController.getInstance();

  // Fetch the favorite status from the backend
  const fetchFavoriteStatus = async () => {
    const exists = await controller.checkCarInShortListController(car.id);
    setLiked(exists); // Update liked status based on the result
    setModal(null); // Clear any existing modal
  };

  // Ensure the fetchFavoriteStatus runs only once when the component mounts or car.id changes
  useEffect(() => {
    fetchFavoriteStatus();
  }, [car.id]); // Dependency array ensures this runs only when car.id changes

  const toggleLike = async () => {
    const boundary = HandleShortlistUI.getInstance();

    // Display the modal
    const modal = boundary.displayHandleShortlistUI(
      fetchFavoriteStatus,
      car.id
    );
    setModal(modal);
    setLiked(!liked);
  };

  const handleLoanButton = () => {
    router.push("/product/loan_calculator");
  };

  return (
    <>
      <div className="flex flex-wrap gap-8 py-10 px-5 w-full justify-center bg-gray-100 container">
        <div className="relative overflow-hidden">
          <CldImage
            src={car.imgUrl}
            alt="Preview"
            width={1000}
            height={1000}
            className="object-cover shadow-lg rounded-lg"
            style={{ width: "350px", height: "250px" }}
          />
          <div
            onClick={toggleLike}
            className="absolute top-3 right-3 cursor-pointer text-red-500"
          >
            {liked ? (
              <FaHeart size={24} className="transition-all duration-200" />
            ) : (
              <FaRegHeart size={24} className="transition-all duration-200" />
            )}
          </div>
        </div>
        <div className="max-w-lg min-w-96 space-y-4 p-5 bg-white shadow-lg rounded-lg">
          <div className="flex justify-between">
            <h1 className="font-extrabold text-3xl text-gray-800">
              {car.title}
            </h1>
            <h2 className="text-gray-600 font-bold">{car.viewCount} views</h2>
          </div>
          <h2 className="font-bold text-xl text-green-500">${car.price}</h2>
          <Link href={`/product/user_review/${car.agentEmail}`}>
            <p className="text-primary">{car.agentEmail}</p>
          </Link>
          <p className="text-gray-600 leading-relaxed">{car.description}</p>
          <div>
            <ul className="list-disc list-inside text-gray-700">
              <li>
                <span className="font-semibold">Color:</span> {car.color}
              </li>
              <li>
                <span className="font-semibold">Condition:</span>{" "}
                {car.condition}
              </li>
              <li>
                <span className="font-semibold">Mileage:</span> {car.mileage}
              </li>
              <li>
                <span className="font-semibold">Manufactured Year:</span>{" "}
                {car.manufacturedYear}
              </li>
            </ul>
          </div>
          <br />
          <Button onClick={handleLoanButton}>Calculate Loan</Button>
        </div>
      </div>
      {modal}
    </>
  );
};

export default UsedCarDetail;

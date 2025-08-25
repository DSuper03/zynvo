import Image from "next/image";

type EventBadgeProps = {
  eventName: string;
  eventTimings: string; // NEW prop
  collegeName: string;
  clubName: string;
  profileImage?: string;
  qrCodeImage?: string;
  style?: {
    backgroundColor?: string;
    textColor?: string;
    backgroundImage?: string;
    overlayOpacity?: number;
  };
};

const EventBadgeCard: React.FC<EventBadgeProps> = ({
  eventName,
  eventTimings,
  collegeName,
  clubName,
  profileImage,
  qrCodeImage,
  style = {},
}) => {
  const {
    backgroundColor = "black",
    textColor = "white",
    backgroundImage,
    overlayOpacity = 0.7,
  } = style;

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative">
        {/* Badge Clip */}
        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="w-16 h-10 bg-gray-300 rounded-lg shadow-md flex items-center justify-center">
            <div className="w-10 h-4 bg-gray-200 rounded-md shadow-inner" />
          </div>
          <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-gray-400 rounded-full shadow">
            <div className="w-2 h-2 bg-gray-500 rounded-full mx-auto mt-1"></div>
          </div>
        </div>

        {/* Card */}
        <div
          className="text-white rounded-2xl shadow-xl p-6 w-80 h-[450px] flex flex-col justify-between relative overflow-hidden"
          style={{
            backgroundColor,
            backgroundImage: backgroundImage
              ? `url(${backgroundImage})`
              : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            color: textColor,
          }}
        >
          {/* Dark Overlay */}
          {backgroundImage && (
            <div
              className="absolute inset-0 bg-black rounded-2xl"
              style={{ opacity: overlayOpacity }}
            />
          )}

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full">
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="text-3xl font-bold tracking-wide text-yellow-400">
                Zynvo
              </div>
              <div className="text-xl font-extrabold tracking-widest">
                {eventName}
              </div>
              <div className="text-sm text-gray-300 font-medium">
                {eventTimings}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700 my-3" />

            {/* Info */}
            <div>
              <div className="text-white text-lg font-bold">{clubName}</div>
              <div className="text-gray-300 text-sm mt-1">{collegeName}</div>
            </div>

            {/* Bottom */}
            <div className="flex justify-between items-end mt-4">
              {/* QR */}
              {qrCodeImage && (
                <div>
                  <img src={qrCodeImage} alt="QR Code" />
                </div>
              )}

              {/* Profile */}
              {profileImage && (
                <div className="relative h-16 w-16 rounded-full ring-2 ring-white shadow-xl overflow-hidden">
                  <img src={profileImage} alt="" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventBadgeCard;

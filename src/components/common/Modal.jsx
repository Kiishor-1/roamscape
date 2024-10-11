const Modal = ({ show, onClose, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full lg:max-w-[70%] max-h-[80vh] p-6 pt-0 rounded-lg relative overflow-y-auto">
                <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 text-2xl">&times;</button>
                {/* {loading ? (
                    <div className="flex items-center justify-center h-48">
                        <div className="w-full h-36 bg-gray-200 text-2xl text-gray-300 rounded-lg animate-pulse flex items-center justify-center">
                            Processing...
                        </div>
                    </div>
                ) : (
                    children
                )} */}
                {
                    children
                }
            </div>
        </div>
    );
};

export default Modal;

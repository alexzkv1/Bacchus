export default function Card({auctions}){
    console.log(auctions);
    return (
        <div className="flex flex-wrap gap-12">
        {auctions.map((auction) => (
            <div className="card bg-base-100 w-95 shadow-xl" key={auction.productId}>
                <div className="card-body">
                    <h2 className="card-title">{auction.productName}</h2>
                    <p>{auction.productDescription}</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Buy Now</button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
}

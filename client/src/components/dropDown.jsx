export default function DropDown({categories, filterAuctions}){

    return(
        <div className="dropdown dropdown-hover dropdown-right">
  <div tabIndex={0} role="button" className="btn m-1 btn-active text-lg font-medium shadow-md">
    Categories
  </div>
  <ul
    tabIndex={0}
    className="dropdown-content menu bg-base-100 rounded-box z-[1] w-48 p-2 shadow"
  >
    {categories.map((category) => (
      <li key={category} id={category}>
        <button onClick={filterAuctions}>{category}</button>
      </li>
    ))}
  </ul>
</div>
    )
};  
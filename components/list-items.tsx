type ListItems = {
  items: [
    {
      id: string;
      text: string;
    }
  ];
};

export default function ListItems({ items }: ListItems) {
  return (
    <ul className="text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
      {items?.map((item) => (
        <li
          key={item.id}
          className="w-full px-4 py-2 border-b border-gray-200 rounded-t-lg dark:border-gray-600"
        >
          {item.text}
        </li>
      ))}
    </ul>
  );
}

interface Iprops {
	content: string;
	createdAt: Date;
}

const MessageCard = ({ content, createdAt }: Iprops) => {
  
	return (
		<div className="">
			<p>{content}</p>
			<p>{createdAt.toDateString()}</p>
		</div>
	);
};

export default MessageCard;

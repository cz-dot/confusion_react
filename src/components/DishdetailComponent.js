import React from 'react';
import { Card, CardImg, CardBody, CardText, CardTitle, Breadcrumb, BreadcrumbItem, 
	Modal, ModalBody, ModalHeader, Button, Col, Row, Label } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Loading } from './LoadingComponent';

const maxLength = (len) => (val) => !(val) || (val.length <= len);
const minLength = (len) => (val) => (val) && (val.length >= len);

class CommentForm extends React.Component {
	
	constructor(props) {
		super(props);

		this.state = {
			 isModalOpen : false
		}

		this.toggleModal = this.toggleModal.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}

	handleSubmit(values) {
		this.toggleModal();
    this.props.addComment(this.props.dishId, values.rating, values.author, values.comment);
	}

	toggleModal(){
		this.setState({
			isModalOpen: !this.state.isModalOpen
		});
	}

	render(){
		return(
			<React.Fragment>
				<Button outline onClick={this.toggleModal}>
					<span className="fa fa-pencil fa-lg"></span> Submit Comments
				</Button>
				<Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
					<ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
					<ModalBody>
						<LocalForm onSubmit={(values) => this.handleSubmit(values)}>
							<Row className="form-group">
								<Label htmlFor="rating" md={12}>Rating</Label>
								<Col md={12}>
									<Control.select model=".rating" name="rating" id="rating" className="form-control">
										<option>1</option>
										<option>2</option>
										<option>3</option>
										<option>4</option>
										<option>5</option>
									</Control.select>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="author" md={12}>Your Name</Label>
								<Col md={12}>
									<Control.text model=".author" name="author" id="author" placeholder="Your Name"
									validators={{minLength: minLength(3), maxLength: maxLength(15)}} 
									className="form-control"/>
									<Errors className="text-danger" model=".author" show="touched" 
									messages={{
										minLength: "Must be greater than 2 characters",
										maxLength: "Must be 15 characters or less"
									}}/>
								</Col>
							</Row>
							<Row className="form-group">
								<Label htmlFor="comment" md={12}>Comment</Label>
								<Col md={12}>
									<Control.textarea model=".comment" name="comment" id="comment" 
									className="form-control" rows="6"/>
								</Col>
							</Row>
							<Row className="form-group">
								<Col md={10}>
									<Button type="submit" color="primary">Submit</Button>
								</Col>
							</Row>
						</LocalForm>
					</ModalBody>
				</Modal>
			</React.Fragment>
		);
	};
}

function RenderDish({dish}) {
	if (dish != null) {
		return (
			<React.Fragment>
				<div className="col-12 col-md-5 m-1">
					<Card>
						<CardImg width="100%" src={dish.image} alt={dish.name} />
						<CardBody>
							<CardTitle>{dish.name}</CardTitle>
							<CardText>{dish.description}</CardText>
						</CardBody>
					</Card>
				</div> 
			</React.Fragment>
		);
	} else {
		return (
			<div></div>
		);
	}
}

function RenderComments({comments, addComment, dishId}) {
	if (comments && comments.length) {
		return (
			<div className="col-12 col-md-5 m-1">
				<h4>Comments</h4>
				<ul className="list-unstyled">
					{ comments.map((comment) => {
						const commentDate = new Date(comment.date);
						return (
							<li key={comment.id}>
								<p>{ comment.comment }</p>
								<p>-- { comment.author }, { commentDate.toLocaleString('en-US', { month: 'short', day: '2-digit' }) } , { commentDate.getFullYear() }</p>
							</li>
						)
					}) }
				</ul>
				<CommentForm dishId={dishId} addComment={addComment}/>
			</div>
		);
	} else {
		return (
			<div>	
				<div className="col-12 col-md-5 m-1">
					<h4>Comments</h4>
					<CommentForm dishId={dishId} addComment={addComment}/>
				</div>
			</div>
		);
	}
}

const DishDetail = (props) => {
	if (props.isLoading) {
		return (
			<div className="container">
				<div className="row">
					<Loading />
				</div>
			</div>
		);
	}
	else if (props.errMess) {
		return (
			<div className="container">
				<div className="row">
					<h4>{props.errMess}</h4>
				</div>
			</div>
		);
	}
	else if (props.dish != null){
		
	return (
		<div className="container">
			<div className="row">
				<Breadcrumb>
					<BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
					<BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
				</Breadcrumb>
				<div className="col-12">
					<h3>{props.dish.name}</h3>
					<hr />
				</div>
			</div>
			<div className="row">
				<RenderDish dish={props.dish}/>
				<RenderComments comments={props.comments} 
				  addComment={props.addComment} dishId={props.dish.id}/>
			</div>
		</div>
	);
	} 
}


export default DishDetail;
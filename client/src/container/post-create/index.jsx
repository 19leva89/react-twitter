import { memo, useCallback, useReducer } from "react"
import { Alert, Loader } from "../../components/load"
import { requestInitialState, requestReducer, REQUEST_ACTION_TYPE } from "../../utils/request"
import Grid from "../../components/grid"
import FieldForm from "../../components/field-form"
import "./style.css"


const PostCreate = ({ onCreate, placeholder, button, id = null }) => {
	const [state, dispatch] = useReducer(requestReducer, requestInitialState)

	const convertData = useCallback(({ value }) => {
		return JSON.stringify({
			text: value,
			username: "user",
			postId: id
		})
	}, [id])

	const sendData = useCallback(async (dataToSend) => {
		dispatch({
			type: REQUEST_ACTION_TYPE.PROGRESS
		})

		try {
			const res = await fetch("http://localhost:4000/post-create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: convertData(dataToSend)
			})

			const data = await res.json()

			if (res.ok) {
				dispatch({
					type: REQUEST_ACTION_TYPE.RESET
				})

				if (onCreate) {
					onCreate()
				} else {
					dispatch({
						type: REQUEST_ACTION_TYPE.ERROR,
						payload: data.message
					})
				}
			}

		} catch (err) {
			dispatch({
				type: REQUEST_ACTION_TYPE.ERROR,
				payload: err.message
			})
		}
	}, [convertData, onCreate])

	const handleSubmit = useCallback((value) => {
		return sendData({ value })
	}, [sendData])

	console.log('render')

	return (
		<Grid>
			<FieldForm
				placeholder={placeholder}
				button={button}
				onSubmit={handleSubmit}
			/>
			{state.status === REQUEST_ACTION_TYPE.ERROR && (<Alert status={state.status} message={state.message} />)}
			{state.status === REQUEST_ACTION_TYPE.PROGRESS && <Loader />}
		</Grid>
	);
}

export default memo(PostCreate, (prev, next) => {
	// console.log(prev, next)
	return true
});
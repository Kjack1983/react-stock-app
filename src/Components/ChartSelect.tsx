import React from "react";
import {
    Select,
    FormHelperText,
    FormControl,
    InputLabel,
    MenuItem,
    Input,
    makeStyles,
    Paper,
    Grid,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
    root: {
        "& .MuiFormControl-root": {
            width: "90% !important",
            marginLeft: "10px",
            marginBottom: "20px",
        },
        "& .MuiGrid-root": {
            width: "120px",
            marginBottom: "20px !important",
        },
        "& .MuiButtonBase-root": {
            marginTop: "20px",
        },
        "& .Mui-selected": {
            background: "#e0e0e0",
            "&:hover": {
                background: "#e0e0e0",
            },
        },
        "& .MuiTypography-body1": {
            fontWeight: "300",
        },
        "& .MuiFormLabel-root": {
            fontSize: "16px",
            color: "#0f5b8e",
        },
        "& .MuiInputBase-root": {
            marginTop: "19px",
        },
        "& .MuiIconButton-colorInherit": {
            marginTop: "0px",
        },
        "& .MuiTablePagination-toolbar": {
            fontWeight: "400",
            fontStyle: "italic",
            color: "#4d4e52",
        },
        "& .MuiTablePagination-selectRoot": {
            marginTop: "8px",
            marginLeft: "0px",
            marginRight: "10px",
        },
        "& .MuiTablePagination-select": {
            fontSize: "15px",
        },
        "& .MuiTablePagination-caption": {
            fontSize: "15px",
        },
        "& .MuiTab-root": {
            minWidth: "120px",
        },
        "&. MuiPaper-elevation4": {
            boxShadow: "none",
        },
    },

    formControl: {
        width: "15% !important",
        "& label span": {
            color: "red",
        },
        paddingRight: "25px",
    },
    pageContent: {
        padding: theme.spacing(1),
    },
}));

// Interface for selector props.
type selectorProps = {
    width: number;
    title: string;
    category: string;
    value: string;
    onChangeValue: (event: any, value: string) => void;
    inputSelect: any;
};

/**
 * Chart component display candlesticks using canvas js.
 *
 * @param {string} symbol
 * @param {string} size
 * @return {JSX}
 */
const ChartSelect: React.FC<selectorProps> = ({
    width,
    title,
    category,
    value,
    onChangeValue,
    inputSelect,
}: selectorProps): JSX.Element => {
    const classes = useStyles();

    return (
        <Grid item xs={2} className={classes.root}>
            <Paper className={classes.pageContent}>
                <FormControl className={classes.formControl}>
                    <InputLabel disableAnimation={false} htmlFor="Stock">
                        {title} *
                    </InputLabel>
                    <Select
                        value={value}
                        onChange={(event) => {
                            onChangeValue(event, category);
                        }}
                        input={<Input name={title} id={"#" + title} />}
                    >
                        <MenuItem selected disabled value="">
                            <em>Please select</em>
                        </MenuItem>
                        {inputSelect.map((option) => {
                            return (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            );
                        })}
                    </Select>
                    <FormHelperText>Select {title}</FormHelperText>
                </FormControl>
            </Paper>
        </Grid>
    );
};

export default ChartSelect;
